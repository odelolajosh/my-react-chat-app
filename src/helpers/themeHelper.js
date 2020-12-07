

export const denotiveColor = {
    errorColor: "var(--base-red)",
    warningColor: "var(--base-orange)"
}

export const dayColor = {
    backgroundColor: "var(--light-background)",
    contrastColor: "var(--light-contrast-neutral)",
    contrastColorMid: "var(--base-light-contrast-mid)",
    contrastColorFade: "var(--base-light-contrast-fade)",
    contrastColorFall: "var(--base-light-contrast-fall)",
    textColor: "var(--text-black)",
    textContrastColor: "var(--text-black-contrast)"
}

export const nightColor = {
    backgroundColor: "var(--dark-background)",
    contrastColor: "var(--dark-contrast-neutral)",
    contrastColorMid: "var(--base-dark-contrast-mid)",
    contrastColorFade: "var(--base-dark-contrast-fade)",
    contrastColorFall: "var(--base-dark-contrast-fall)",
    textColor: "var(--text-white)",
    textContrastColor: "var(--text-white-contrast)"
}

export const themeMap = (state) => ({
    primaryColor: "var(--base-color)",
    secondaryColor: "var(--base-color-dark)",
    ...denotiveColor,
    ...( state === 'day' ? { ...dayColor } : { ...nightColor } )
})