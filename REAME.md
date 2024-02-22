# Tiny-animate-js

> mockup of `gsap` lib with some core features.

## Supported features

- `from`, `to`, `fromTo` methods
- `timeline` method
- last parameter of `from`, `to`, `fromTo` methods is an object with `delay`, `duration`, `ease` properties
- last parameter of `timeline` method is an object with `offset`, `duration`, `ease` properties

## Cautions

- `duration`, `offset` properties are in seconds
- `ratate` property is in degrees
- `opacity` property is in range from 0 to 1
- `x`, `y` properties are in pixels, but you can use percentage values `x: "50%"`

## Usage

### `animate.[something]()`

```js
animate.from(
    "h1",
    {
        y: -20,
        opacity: 0,
    },
    {
        duration: 2,
        ease: "power4.out",
    },
);
```

### `animate.timeline()`

```js
const tl = animate.timeline();

tl.fromTo(
    "h1",
    {
        y: -20,
        opacity: 0,
    },
    {
        y: 20,
        opacity: 1,
        rotate: 45,
    },
    {
        duration: 2,
        ease: "power4.out",
    },
);

tl.from(
    "h2",
    {
        y: 20,
        opacity: 0,
    },
    {
        duration: 0.7,
        ease: "power4.out",
    },
);

tl.to(
    "h3",
    {
        y: -10,
        x: 100,
        opacity: 0,
        rotate: 90,
    },
    {
        duration: 0.7,
        ease: "power4.out",
    },
);

```
