import {
    Combobox,
    ComboboxButton,
    ComboboxInput,
    ComboboxOption,
    ComboboxOptions,
} from "@headlessui/react";
import { useState } from "react";
import { HiCheck, HiChevronUpDown } from "react-icons/hi2";

export const UserPicker = ({ value, options, onSelect }) => {
    const [selected, setSelected] = useState(value);
    const [query, setQuery] = useState("");

    const filteredOptions =
        query === ""
            ? options
            : options.filter((user) =>
                  user.name
                      .toLowerCase()
                      .replace(/\s+/g, "")
                      .includes(query.toLowerCase().replace(/\s+/g, ""))
              );

    const onSelected = (users) => {
        setSelected(users);
        onSelect(users);
    };
    return (
        <>
            <Combobox
                multiple
                value={selected}
                onChange={onSelected}
                onClose={() => setQuery("")}
            >
                <div className="relative mt-1">
                    <div className="relative w-full cursor-default overflow-hidden rounded-lg text-left shadow-md focus:outline-none sm:text-sm">
                        <ComboboxInput
                            aria-label="Group Members"
                            onChange={(event) => setQuery(event.target.value)}
                            className="border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm mt-1 block w-full"
                            placeholder="Select Users ..."
                        />
                        <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
                            <HiChevronUpDown
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                            />
                        </ComboboxButton>
                    </div>
                </div>
                <ComboboxOptions
                    anchor="bottom"
                    transition
                    className="border empty:invisible bg-gray-600 origin-top transition duration-200 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
                >
                    {filteredOptions.length === 0 && query !== "" ? (
                        <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                            Nothing found.
                        </div>
                    ) : (
                        filteredOptions.map((user) => (
                            <ComboboxOption
                                key={user.id}
                                value={user}
                                className={`relative cursor-default select-none py-2 pl-10 pr-4 data-[focus]:bg-teal-600 data-[selected]:bg-teal-800 hoverfocus:bg-teal-600`}
                            >
                                {({ selected }) => (
                                    <>
                                        <span
                                            className={`block truncate data-[focus]:bg-teal-100 ${
                                                selected
                                                    ? "font-bold"
                                                    : "font-normal"
                                            }`}
                                        >
                                            {user.name}
                                        </span>
                                        {selected ? (
                                            <span
                                                className={`absolute inset-y-0 left-0 flex items-center pl-3 text-white`}
                                            >
                                                <HiCheck
                                                    className="h-5 w-5"
                                                    aria-hidden="true"
                                                />
                                            </span>
                                        ) : null}
                                    </>
                                )}
                            </ComboboxOption>
                        ))
                    )}
                </ComboboxOptions>
            </Combobox>
            {selected && (
                <>
                    <span className="block mt-2">
                        {selected.length
                            ? `${selected.length} users selected`
                            : ""}
                    </span>

                    <div className="grid sm:grid-cols-3 gap-2 mt-3">
                        {selected.map((user) => (
                            <div
                                key={user.id}
                                className="badge badge-primary gap-2"
                            >
                                {user.name}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </>
    );
};
