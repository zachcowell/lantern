# Lantern Militia

## App overview

This project will be a spotted lanternfly tracking app where users can upload pictures/locations of spotted lanternflies so that other users may track/kill the bugs. The MVP features include:

- Display a map of spotted lanternfly sightings in the area. These sightings would be crowd-sourced
- Allow users to upload geo-tagged photos of lanternfly sightings and/or killed lanternflies
- Provide resources on spotted lanternflies (mostly provided by USDA.gov and other resources)
- Show a bounty score per user (i.e., score based on uploaded sightings, destroyed bugs, destroyed eggs, etc). Metrics tracked:
  - Total lanternfly sightings
  - Total lanternflies killed
  - Egg nests destroyed
  - Total patrols (maybe map user routes on map?)

## Screens

- Home screen
  - Shows metrics in a "Card" like display. Each Card should take up half the width of the screen. The metrics displayed should be:
    - Total lanternfly sightings
    - Total lanternflies killed
    - Egg nests destroyed
    - Total number of patrols
  - By default, this shows all user uploaded data. There should be a toggle that shows all of the current user's data
- Map
  - Displays a map of live sightings
  - Filter toggle to show all sightings (including killed lanternflies)
- Patrols
  - List view showing historical patrols
- Upload
  - The "+" / "Upload" screen has multiple features:
    - Upload images of sightings (or killed) lanternflies. It should geo-tag this information
    - Button for "Start new Patrol"
  - Upload image of sightings (or killed lanternflies). This will geo-tag each upload on the map
  - Can click "Start New Patrol" to begin tracking the users location, their route, and their patrol
  - Data is uploaded to AWS S3 buckets
- Resources
  - USDA.gov resources
  - Amazon affiliate links for salt guns that can be used to kill lanternflies
    - Other resources such as gloves, hand sanitizer, and other recommended equipment
