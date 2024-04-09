import { ref, onBeforeUnmount } from 'vue';

function useMediaQuery(queries) {
    let matches = new Array(queries.length).fill().map(() => ref(false));

    const setMatches = () => {
        for (let i = 0; i < queries.length; i++) {
            const { maxWidth = null, minWidth = null } = queries[i];

            if (maxWidth === null && minWidth === null) {
                matches[i].value = false;
                continue;
            }
            const widthIndicator = maxWidth ? 'max-width' : 'min-width';
            const widthValue = maxWidth ?? minWidth;

            const matchMedia = window.matchMedia(`(${widthIndicator}: ${widthValue})`);

            if (matches[i].value === matchMedia.matches) continue;

            matches[i].value = matchMedia.matches;
        }
    };

    setMatches();

    let resizeListener = window.addEventListener('resize', setMatches);

    onBeforeUnmount(() => {
        window.removeEventListener('resize', resizeListener);
    });
    return matches;
}

export default useMediaQuery;
