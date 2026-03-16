# Adding Trips to the Travel Page

This document explains how to add new trips to the Travel page.

## Quick Start

1. Open `src/data/trips.ts`
2. Copy the `trip-template` object at the bottom
3. Fill in your trip details (id, location, name, subtitle, stops)
4. Add images to `public/images/[TripFolder]/`
5. Reference images in the `images` array

## Adding a New Trip

### 1. Create the Trip Object

Copy the template entry from `trips.ts`:

```typescript
{
  id: 'my-trip-id',
  location: 'State / Country',
  name: 'Trip Name',
  subtitle: 'A short description of the trip.',
  stops: [
    // add stops here
  ],
},
```

Fill in each field:

- **id**: Unique kebab-case identifier (e.g., `grand-staircase-escalante`)
- **location**: State/country where the trip took place
- **name**: Display name for the trip
- **subtitle**: 1-2 sentence overview of the trip
- **stops**: Array of locations/activities during the trip (see below)

### 2. Add Trip Stops

Each stop has three fields:

```typescript
{
  name: 'Stop Name',
  paragraphs: [
    'First paragraph of narrative text.',
    'Second paragraph.',
    // ... more paragraphs as needed
  ],
  images: [
    '/images/MyTrip/photo1.jpg',
    '/images/MyTrip/photo2.jpg',
  ],
}
```

- **name**: Name of the location or activity
- **paragraphs**: Array of narrative text blocks. Each string is displayed as a separate paragraph.
- **images**: Array of image paths (see "Adding Images" below)

### 3. Add Images

1. Create a folder in `public/images/` named after your trip (e.g., `public/images/MyTrip/`)
2. Place your image files there (JPG or PNG)
3. Reference them in the `images` array using the path: `/images/MyTrip/filename.jpg`

Images are displayed in the order they appear in the array.

## Example: Grand Staircase Escalante Trip

The `grand-staircase-escalante` trip in `trips.ts` is a complete example:

- **3 stops** (Calf Creek Falls, Spooky Canyon Loop, Hell's Backbone Rd)
- **Multiple paragraphs** per stop for detailed narrative
- **Multiple images** per stop (referenced from `public/images/GrandStairs/`)

## Data Structure Reference

### Trip Interface

```typescript
interface Trip {
  id: string           // Unique identifier (kebab-case)
  location: string     // Geographic location
  name: string         // Display name
  subtitle: string     // Short description
  stops: TripStop[]    // Array of trip stops
}
```

### TripStop Interface

```typescript
interface TripStop {
  name: string         // Stop name/location
  paragraphs: string[] // Narrative text (one per array element)
  images: string[]     // Image paths
}
```

## Notes

- Image hosting is currently served from the repository. This may change in the future (e.g., S3, Cloudinary).
- Keep image filenames descriptive and consistent with your folder naming scheme.
- Test your trip by running the dev server (`make dev`) and navigating to the Travel page.
