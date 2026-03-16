export interface TripStop {
  name: string
  paragraphs: string[]
  images: string[]
}

export interface Trip {
  id: string
  location: string
  name: string
  subtitle: string
  stops: TripStop[]
}

export const trips: Trip[] = [
  {
    id: 'grand-staircase-escalante',
    location: 'Utah',
    name: 'Grand Staircase Escalante',
    subtitle:
      "This was a camping trip my father and I took together in June. Located in Southern Utah, The Grand Staircase Escalante is a marvelous place, unlike any other I've seen. And I've been looking forward to going back since I left.",
    stops: [
      {
        name: 'Calf Creek Falls',
        paragraphs: [
          "Starting in Las Vegas, Nevada, my father and I drove up the I-15. A 6-hour drive ahead of us, we were excited to figure out and make use of the Jeep Wrangler we rented. Our destination was Lower Calf Creek Falls, a campsite located next to — what we were going to find out — is located next to one of the most beautiful trails in the National Park.",
          "After 5 hours we began our journey into the park. Before we even reached our campsite we were already in awe at what we were seeing. Huge swaths of land as far as the eye could see, different ecosystems ranging from mountains, to lush green valleys, to desert were all next to each other before we began our descent into the park. Underestimating how busy our campsite was going to be, we were able to secure a spot due to sheer luck of catching a group leaving as soon as we arrived.",
          "After setting up our campsite and having lunch we prepared for our first hike, which was located right next the camp. Calf Creek Falls is a 6 mile hike with a rewarding waterfall at the end. Although I had hiked often before, I had never been on a hike quite like this. With the elevation changes as well as being directly next to the river that the waterfall fed, we got to experience various scenery. Ranging from marshy and green near the river, to red and dry at higher elevations. Arriving at the waterfall, my father and I were greeted with one of the most spectacular sights I've ever seen. The ice cold water felt amazing on our feet and knees after a rigorous hike, and lunch with that scenic view was amazing.",
          "The hike back was just as beautiful although we were retracing our steps. Reaching the end, we got ourselves cleaned up, and started to prepare dinner. It was getting dark out and seeing the stars were marvelous. We didn't bring sleeping bags with us, but fortunately it was mid-summer and we had loads of blankets just in case. In the morning we prepared a breakfast of bacon, potatoes and eggs and prepared for the various hikes we were going to do around the park.",
        ],
        images: [
          '/images/GrandStairs/GSE2.jpg',
          '/images/GrandStairs/GSE6.jpg',
          '/images/GrandStairs/GSE3.jpg',
          '/images/GrandStairs/GSE4.jpg',
          '/images/GrandStairs/GSE5.jpg',
          '/images/GrandStairs/GSE1.jpg',
        ],
      },
      {
        name: 'Spooky Canyon Loop',
        paragraphs: [
          "From the 3 hikes we did our second day at the park, this one was my absolute favorite. The Spooky Canyon Loop began with an almost 2 mile hike to what would be a long, steep descent into the Canyon. This hike is certainly not intended for the impatient. With the sun bearing down it is important to stay hydrated. After the descent there were two gulches that could be tackled, one following the other, before leading back to the beginning — where the ascent to the first 2-mile leg was. We chose to do \"Peek-a-boo\" gulch first and the formations I saw were unlike anything I had seen before in my life. The picture below shows my dad walking to the gulches after the descent. After balancing our way down the steep mountainside, we were eager to be on flat ground again. The massive wall to the left of him leads us to the open valleys where the gulches are located.",
          "Peek-a-boo gulch was breathtaking — between the magnificent rock formations and the tight places to squeeze between, it was a hiking experience like no other. After about 30 minutes of \"crawling\" through the gulch and taking as many pictures as we could, we found an open area where we could rest and eat. Another father and son hiking duo came across our little picnic and after a friendly exchange of words, they went on their way. After we finished our food, we began to hike again and we quickly came to the end of the first gulch. Unfortunately we became disoriented and had to turn back. After making it back to the beginning of the valley and to the ascent, we realized we had underestimated the difficulty of the climb up and spent most of our energy making it back to the top. After hydrating and resting at the top of the climb, we made the 2-mile hike back to the car.",
        ],
        images: [
          '/images/GrandStairs/GSE9.jpg',
          '/images/GrandStairs/GSE10.jpg',
          '/images/GrandStairs/GSE7.jpg',
          '/images/GrandStairs/GSE8.jpg',
        ],
      },
      {
        name: "Hell's Backbone Rd",
        paragraphs: [
          "On our final day we decided to take the 38-mile long, scenic road between the towns of Boulder and Escalante. Easily my favorite leg of the trip, the elevation climb led to some of the most beautiful forest scenes and sights I had seen in a long time. Although unpaved, there were a good amount of people also checking out the route — although not too many to hinder the experience in any way — and for the most part we remained by ourselves in our vehicle during the drive. Below is my favorite photo from the entire camping trip and a picture of me near Hell's Backbone Bridge, with a 1,500+ foot drop around me.",
        ],
        images: [
          '/images/GrandStairs/GSE13.jpg',
          '/images/GrandStairs/GSE11.jpg',
          '/images/GrandStairs/GSE12.jpg',
        ],
      },
    ],
  },
  {
    id: 'trip-template',
    location: 'State / Country',
    name: 'Trip Name',
    subtitle: 'This is a template entry — replace this subtitle with a short description of the trip.',
    stops: [
      {
        name: 'Stop Name',
        paragraphs: [
          "This is a template trip. To add a new trip, duplicate this object in src/data/trips.ts and fill in the id, location, name, subtitle, and stops fields. Add your images to public/images/[TripFolder]/ and reference them in the images array below.",
        ],
        images: [],
      },
    ],
  },
]
