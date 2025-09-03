# Responsive Layout System

This project uses a responsive layout system with SCSS modules. The system is designed to be fluid and component-based, adapting to different screen sizes.

## Breakpoints

The system uses the following breakpoints:

- **Mobile Small**: 360px
- **Mobile**: 425px
- **Tablet**: 600px
- **Desktop**: 1024px (full screen)

## Directory Structure

```
src/styles/
├── abstracts/         # Variables, mixins, functions
│   ├── _variables.scss
│   └── _mixins.scss
├── base/              # Base styles
│   ├── _reset.scss
│   └── _typography.scss
├── layout/            # Layout components
│   └── _container.scss
├── components/        # Component-specific styles
└── main.scss          # Main entry point
```

## Usage

### Responsive Mixins

Use the `respond-to` mixin to apply styles at different breakpoints:

```scss
@use '../abstracts/mixins' as mix;

.my-component {
  // Default styles (mobile-first)
  
  @include mix.respond-to('mobile-small') {
    // Styles for 360px and up
  }
  
  @include mix.respond-to('mobile') {
    // Styles for 425px and up
  }
  
  @include mix.respond-to('tablet') {
    // Styles for 600px and up
  }
  
  @include mix.respond-to('desktop') {
    // Styles for 1024px and up
  }
}
```

### Container

Use the `container` mixin to create a responsive container:

```scss
@use '../abstracts/mixins' as mix;

.my-container {
  @include mix.container;
}
```

### Grid System

The system includes both flexbox and CSS Grid utilities:

#### Flexbox Row

```scss
@use '../abstracts/mixins' as mix;

.flex-container {
  @include mix.flex-row;
}
```

#### CSS Grid

```scss
@use '../abstracts/mixins' as mix;

.grid-container {
  @include mix.grid(4, 16px); // 4 columns with 16px gap
  
  @include mix.respond-to('mobile-small') {
    @include mix.grid(2, 8px); // 2 columns with 8px gap on mobile
  }
}
```

## Example

See `App.module.scss` and `App.tsx` for a complete example of how to use the responsive layout system.