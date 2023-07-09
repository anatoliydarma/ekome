<script lang="ts">
	import { TelInput, normalizedCountries, clickOutsideAction, isSelected } from 'svelte-tel-input';

	import type {
		DetailedValue,
		CountrySelectEvents,
		CountryCode,
		E164Number,
		TelInputOptions,
		Country
	} from 'svelte-tel-input/types';

	import { createEventDispatcher } from 'svelte';
	import { getFlagEmoji } from '$lib/client/utils';

	let clickOutside = true;
	let closeOnClick = true;
	export let disabled = false;
	let detailedValue: DetailedValue | null = null;
	export let value: E164Number | null;
	export let searchPlaceholder: string | null = 'Search';
	export let selectedCountry: CountryCode | null = 'FR';
	export let name = 'phone';
	export let id = 'phone';

	let searchText = '';
	let isOpen = false;
	let valid: boolean;

	let options: TelInputOptions;

	$: selectedCountryDialCode =
		normalizedCountries.find((el) => el.iso2 === selectedCountry)?.dialCode || null;

	const toggleDropDown = (e?: Event) => {
		e?.preventDefault();
		if (disabled) return;
		isOpen = !isOpen;
	};

	const closeDropdown = (e?: Event) => {
		if (isOpen) {
			e?.preventDefault();
			isOpen = false;
			searchText = '';
		}
	};

	const selectClick = () => {
		if (closeOnClick) closeDropdown();
	};

	const closeOnClickOutside = () => {
		if (clickOutside) {
			closeDropdown();
		}
	};

	const sortCountries = (countries: Country[], text: string) => {
		const normalizedText = text.trim().toLowerCase();
		if (!normalizedText) {
			return countries.sort((a, b) => a.label.localeCompare(b.label));
		}
		return countries.sort((a, b) => {
			const aNameLower = a.name.toLowerCase();
			const bNameLower = b.name.toLowerCase();
			const aStartsWith = aNameLower.startsWith(normalizedText);
			const bStartsWith = bNameLower.startsWith(normalizedText);
			if (aStartsWith && !bStartsWith) return -1;
			if (!aStartsWith && bStartsWith) return 1;
			const aIndex = aNameLower.indexOf(normalizedText);
			const bIndex = bNameLower.indexOf(normalizedText);
			if (aIndex === -1 && bIndex === -1) return a.id.localeCompare(b.id);
			if (aIndex === -1) return 1;
			if (bIndex === -1) return -1;
			const aWeight = aIndex + (aStartsWith ? 0 : 1);
			const bWeight = bIndex + (bStartsWith ? 0 : 1);
			return aWeight - bWeight;
		});
	};

	const handleSelect = (val: CountryCode, e?: Event) => {
		if (disabled) return;
		e?.preventDefault();
		if (
			selectedCountry === undefined ||
			selectedCountry === null ||
			(typeof selectedCountry === typeof val && selectedCountry !== val)
		) {
			selectedCountry = val;
			onChange(val);
			selectClick();
		} else {
			dispatch('same', { option: val });
			selectClick();
		}
	};

	const dispatch = createEventDispatcher<CountrySelectEvents<CountryCode>>();

	const onChange = (selectedCountry: CountryCode) => {
		dispatch('change', { option: selectedCountry });
	};
</script>

<div
	class="flex relative rounded-lg {valid
		? ``
		: ` ring-pink-500 dark:ring-pink-500 ring-1 focus-within:ring-offset-1 focus-within:ring-offset-pink-500/50 focus-within:ring-1`}"
>
	<div class="flex" use:clickOutsideAction={closeOnClickOutside}>
		<button
			id="states-button"
			data-dropdown-toggle="dropdown-states"
			class="relative flex-shrink-0 overflow-hidden z-10 whitespace-nowrap inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-primary-500 bg-primary-100 border border-primary-300 rounded-l-md hover:bg-primary-200 focus:outline-none dark:bg-primary-700 dark:hover:bg-primary-600 dark:text-white dark:border-primary-600"
			type="button"
			role="combobox"
			aria-controls="dropdown-countries"
			aria-expanded="false"
			aria-haspopup="false"
			on:click={toggleDropDown}
		>
			{#if selectedCountry && selectedCountry !== null}
				<div class="inline-flex items-center text-left">
					<span class="mr-3">
						{getFlagEmoji(selectedCountry.toLowerCase())}
					</span>
					<span class="text-primary-600 dark:text-primary-400">+{selectedCountryDialCode} </span>
				</div>
			{:else}
				Please select
			{/if}
			<svg
				aria-hidden="true"
				class="ml-1 w-4 h-4 {isOpen ? 'rotate-180' : ''}"
				fill="currentColor"
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					fill-rule="evenodd"
					d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
					clip-rule="evenodd"
				/>
			</svg>
		</button>
		{#if isOpen}
			<div
				id="dropdown-countries"
				class="absolute z-10 max-w-fit bg-white rounded divide-y divide-primary-100 shadow dark:bg-primary-700 overflow-hidden translate-y-11"
				data-popper-reference-hidden=""
				data-popper-escaped=""
				data-popper-placement="bottom"
				aria-orientation="vertical"
				aria-labelledby="country-button"
				tabindex="-1"
			>
				<div
					class="text-sm text-primary-700 dark:text-primary-200 max-h-48 overflow-y-auto"
					aria-labelledby="countries-button"
					role="listbox"
				>
					<input
						aria-autocomplete="list"
						type="text"
						class="px-4 py-2 text-primary-900 focus:outline-none w-full sticky top-0"
						bind:value={searchText}
						placeholder={searchPlaceholder}
					/>
					{#each sortCountries(normalizedCountries, searchText) as country (country.id)}
						{@const isActive = isSelected(country.iso2, selectedCountry)}
						<div id="country-{country.iso2}" role="option" aria-selected={isActive}>
							<button
								value={country.iso2}
								type="button"
								class="inline-flex py-2 px-4 w-full text-sm hover:bg-primary-100 dark:hover:bg-primary-600
                             active:bg-primary-800 dark:active:bg-primary-800 overflow-hidden
                            {isActive
									? 'bg-primary-600 dark:text-white'
									: 'dark:hover:text-white dark:text-primary-400'}"
								on:click={(e) => {
									handleSelect(country.iso2, e);
								}}
							>
								<div class="inline-flex items-center text-left">
									<span class="mr-3">{getFlagEmoji(country.iso2.toLowerCase())}</span>
									<span class="mr-2">{country.name}</span>
									<span class="text-primary-500">+{country.dialCode}</span>
								</div>
							</button>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>

	<TelInput
		bind:country={selectedCountry}
		bind:detailedValue
		bind:value
		bind:valid
		{name}
		{id}
		{options}
		required={true}
		class="text-sm rounded-r-md block w-full p-2.5 focus:outline-none border border-primary-300 border-l-primary-100 dark:border-l-primary-700 dark:border-primary-600 bg-primary-50 dark:bg-primary-700 placeholder-surface-300 dark:text-white text-primary-900 focus:ring-0"
	/>
</div>
