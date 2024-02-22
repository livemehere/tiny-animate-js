const animate = {
    from(selector, props, options) {
        const duration = typeof options === "object" ? options.duration : options;
        const delay = typeof options === "object" ? options.delay : 0;
        const ease = typeof options === "object" ? options.ease : "ease-out";
        const tween = new Tween({
            selector,
            startProps: props,
            duration,
            delay,
            ease,
        });
        tween.setFrom();
        tween.animate.play();
        return tween;
    },
    to(selector, props, options) {
        const delay = typeof options === "object" ? options.delay : options;
        const duration = typeof options === "object" ? options.duration : 1;
        const ease = typeof options === "object" ? options.ease : "ease-out";
        const tween = new Tween({
            selector,
            endProps: props,
            duration,
            delay,
            ease,
        });
        tween.setTo();
        tween.animate.play();
        return tween;
    },
    fromTo(selector, startProps, endProps, options) {
        const delay = typeof options === "object" ? options.delay : options;
        const duration = typeof options === "object" ? options.duration : 1;
        const ease = typeof options === "object" ? options.ease : "ease-out";
        const tween = new Tween({
            selector,
            startProps,
            endProps,
            duration,
            delay,
            ease,
        });
        tween.setFromTo();
        tween.animate.play();
        return tween;
    },
    timeline() {
        return new Timeline();
    },
};

class Tween {
    constructor({ selector, startProps, endProps, duration, ease, delay }) {
        this.selector = selector;
        this.startProps = startProps ?? {};
        this.endProps = endProps ?? {};
        this.duration = duration ?? 1;
        this.ease = ease ?? "ease-out";
        this.delay = delay ?? 0;
        /** @type {Animation} */
        this.animate = null;
        this.eases = {
            "power4.out": "cubic-bezier(0.09, 0.43, 0.25, 1)",
        };
    }

    initFrom(el, startProps) {
        const originStyle = getComputedStyle(el);
        const props = Object.keys(startProps);
        props.forEach((prop) => {
            let v = originStyle[prop];
            if (prop === "scale") {
                if (v === "none" || !v) {
                    v = "1";
                }
            }
            this.endProps[prop] = v;
        });
        el.style.transformOrigin = "center";
        el.style.transform = `translate(${this.setValueWithUnit(this.startProps.x)}, ${this.setValueWithUnit(this.startProps.y)}) scale(${this.startProps.scale || 1}) rotate(${this.startProps.rotate || 0})`;
    }

    initTo(el, endProps) {
        const originStyle = getComputedStyle(el);
        const props = Object.keys(endProps);
        props.forEach((prop) => {
            let v = originStyle[prop];
            if (prop === "scale") {
                if (v === "none" || !v) {
                    v = "1";
                }
            }
            this.startProps[prop] = v;
        });
        el.style.transformOrigin = "center";
        el.style.transform = `translate(${this.setValueWithUnit(this.endProps.x)}, ${this.setValueWithUnit(this.endProps.y)}) scale(${this.endProps.scale || 1}) rotate(${this.endProps.rotate || 0})`;
    }

    initFromTo(el, startProps) {
        el.style.transformOrigin = "center";
        el.style.transform = `translate(${this.setValueWithUnit(startProps.x)}, ${this.setValueWithUnit(startProps.y)}) scale(${startProps.scale || 1}) rotate(${startProps.rotate || 0})`;
        el.style.opacity = startProps.opacity ?? 1;
    }

    setValueWithUnit(v) {
        if (!v) return 0;
        if (typeof v === "number") {
            return `${v ?? 0}px`;
        }
        return v;
    }

    getDefaultOption() {
        return {
            duration: this.duration * 1000,
            fill: "forwards",
            easing: this.eases[this.ease] ?? this.ease,
            delay: this.delay * 1000,
        };
    }

    setFrom() {
        /** @type {HTMLElement} */
        const el = document.querySelector(this.selector);
        this.initFrom(el, this.endProps);

        const { x, y, scale, rotate, opacity } = this.startProps;
        this.animate = el.animate(
            [
                {
                    transformOrigin: "center",
                    transform: `translate(${this.setValueWithUnit(x)}, ${this.setValueWithUnit(y)}) scale(${scale || 1}) rotate(${rotate || 0}deg)`,
                    opacity: opacity ?? 1,
                },
                {
                    transformOrigin: "center",
                    transform: `translate(${this.setValueWithUnit(this.endProps.x)}, ${this.setValueWithUnit(this.endProps.y)}) scale(${this.endProps.scale || 1}) rotate(${this.endProps.rotate || 0})`,
                    opacity: this.endProps.opacity ?? 1,
                },
            ],
            { ...this.getDefaultOption() },
        );
        this.animate.pause();
    }

    setTo() {
        /** @type {HTMLElement} */
        const el = document.querySelector(this.selector);
        this.initTo(el, this.endProps);
        const { x, y, scale, rotate, opacity } = this.endProps;
        this.animate = el.animate(
            [
                {
                    transformOrigin: "center",
                    transform: `translate(${this.setValueWithUnit(this.startProps.x)}, ${this.setValueWithUnit(this.startProps.y)}) scale(${this.startProps.scale || 1}) rotate(${this.startProps.rotate || 0})`,
                    opacity: this.startProps.opacity ?? 1,
                },
                {
                    transformOrigin: "center",
                    transform: `translate(${this.setValueWithUnit(x)}, ${this.setValueWithUnit(y)}) scale(${scale || 1}) rotate(${rotate || 0}deg)`,
                    opacity: this.startProps.opacity ?? 1,
                },
            ],
            { ...this.getDefaultOption() },
        );
        this.animate.pause();
    }

    setFromTo() {
        /** @type {HTMLElement} */
        const el = document.querySelector(this.selector);
        this.initFromTo(el, this.startProps);
        this.animate = el.animate(
            [
                {},
                {
                    transformOrigin: "center",
                    transform: `translate(${this.setValueWithUnit(this.endProps.x)}, ${this.setValueWithUnit(this.endProps.y)}) scale(${this.endProps.scale || 1}) rotate(${this.endProps.rotate || 0}deg)`,
                    opacity: this.endProps.opacity ?? 1,
                },
            ],
            { ...this.getDefaultOption() },
        );
        this.animate.pause();
    }
}

class Timeline {
    startTime;
    elapsedTime;
    timer = null;
    tweenList = [];

    constructor() {}

    #startLoop() {
        if (this.timer) return;
        this.startTime = performance.now();
        this.timer = requestAnimationFrame(this.#loop.bind(this));
    }

    clearLoop() {
        cancelAnimationFrame(this.timer);
        this.timer = null;
        this.startTime = null;
    }

    #loop() {
        if (this.tweenList.some((tween) => !tween.finished) === false) {
            this.clearLoop();
            return;
        }
        this.timer = requestAnimationFrame(this.#loop.bind(this));
        this.elapsedTime = performance.now() - this.startTime;

        for (let i = 0; i < this.tweenList.length; i++) {
            let tween = this.tweenList[i];
            if (tween.finished) continue;
            if (i !== 0) {
                const prevTween = this.tweenList[i - 1];
                tween.timestamp = prevTween.timestamp + prevTween.duration * 1000;
            }

            if (this.elapsedTime >= tween.timestamp + tween.offset * 1000) {
                tween.tween.animate.play();
                tween.finished = true;
            }
        }
    }

    from(...args) {
        const duration = args[2].duration ?? 1;
        const offset = args[2].offset ?? 0;

        const tween = animate.from(...args);
        tween.animate.pause();
        this.tweenList.push({
            tween,
            duration,
            offset,
            timestamp: 0,
            finished: false,
        });
        this.#startLoop();
        return tween;
    }
    to(...args) {
        const duration = args[2].duration ?? 1;
        const offset = args[2].offset ?? 0;
        const tween = animate.to(...args);
        tween.animate.pause();
        this.tweenList.push({
            tween,
            duration,
            offset,
            timestamp: 0,
            finished: false,
        });
        this.#startLoop();
        return tween;
    }
    fromTo(...args) {
        const duration = args[2].duration ?? 1;
        const offset = args[2].offset ?? 0;
        const tween = animate.fromTo(...args);
        tween.animate.pause();
        this.tweenList.push({
            tween,
            duration,
            offset,
            timestamp: 0,
            finished: false,
        });
        this.#startLoop();
        return tween;
    }
}
