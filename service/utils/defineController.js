module.exports = (controller, func) => {

    for (let name of Object.keys(func)) {
        controller.define(name, func[name]);
    }

    return controller;
}