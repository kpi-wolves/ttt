import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import("tailwindcss").Config} */
export default {
    content: [
        "./src/**/*.vue"
    ],
    theme: {
        extend: {
            rotate: {
                135: "135deg"
            }
        },
        gridTemplateColumns: Object.fromEntries(Object.keys(defaultTheme.gridTemplateColumns)
            .map(cols => [cols, `repeat(${cols}, minmax(min-content, 1fr))`]))
    },
    plugins: []
};
