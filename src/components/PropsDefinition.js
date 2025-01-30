export const makeCustomMenuProps = () => ({
    options: { type: Array, default: () => [] },
    keyField: { type: String, default: 'key' },
    valueField: { type: [String, Function], default: 'value' },
    searchable: Boolean,
    menuHeight: { type: String, default: '250px' },
    animation: Boolean,
    visible: Boolean
});
