import { ref, onBeforeMount } from 'vue'

function useMediaQuery({ maxWidth = null, minWidth = null }) {
    const matches = ref(false)

    if (maxWidth === null && minWidth === null) {
        return false
    }

    const widthIndicator = maxWidth ? 'max-width' : 'min-width'
    const widthValue = maxWidth ?? minWidth

    const setMatches = () => {
        const matchMedia = window.matchMedia(`(${widthIndicator}: ${widthValue})`)

        if (matches.value === matchMedia.matches)
            return

        matches.value = matchMedia.matches
    }

    setMatches();

    let resizeListener = window.addEventListener('resize', setMatches)

    onBeforeMount(() => {
        window.removeEventListener('resize', resizeListener)
    })

    return matches
}

export default useMediaQuery