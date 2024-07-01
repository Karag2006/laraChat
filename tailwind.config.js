import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";

const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "class",
    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/views/**/*.blade.php",
        "./resources/js/**/*.jsx",
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ["Figtree", ...defaultTheme.fontFamily.sans],
            },
        },
    },

    plugins: [
        require("daisyui"),
        forms,
        plugin(function ({ addVariant }) {
            addVariant("hoverfocus", ["&:hover", "&:focus-visible"]);
        }),
    ],

    daisyui: {
        themes: ["dark"], // false: only light + dark | true: all themes | array: specific themes like this ["light", "dark", "cupcake"]
    },
};
