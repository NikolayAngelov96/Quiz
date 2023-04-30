type ElementType = keyof HTMLElementTagNameMap;

export function createElement<T>(type: ElementType, props?: Record<string, any>, ...content: any[]) {
    const element = document.createElement(type);

    if (props) {
        for (let propName in props) {
            if (propName.startsWith("on")) {
                const eventName: string = propName.slice(2).toLowerCase();
                element.addEventListener(eventName, props[propName]);
            } else if (propName == "style") {
                for (let entry in props.style) {
                    // @ts-ignore
                    element.style[entry] = props.style[entry];
                }
            } else {
                // @ts-ignore
                element[propName] = props[propName];
            }
        }
    }

    for (let item of content) {
        element.append(item);
    }

    return element as T;
}

export function getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
}