**WHY**

This project was built to explore what happens when randomness comes from a real external source instead of being generated locally through something like Math.random(). Most web projects rely on pseudo-random values created by algorithms, but here the artwork is driven by live entropy pulled from the NIST Randomness Beacon. That made the project a good way to learn how to work with an external randomness API, handle asynchronous data fetching, and build a system that reacts to unpredictable inputs in real time.

The entropy values are converted into positions, colors, sizes, and patterns on the canvas, so each generated image is tied to a unique randomness pulse. Building this also involved handling cases where the API was unavailable, which is why there is a browser crypto fallback to keep the experience working. Overall, the project was a way to combine API integration, creative coding, and interactive design into something visual and fun.

**Tech Stack**

HTML
CSS
JavaScript
p5.js
Vercel Serverless Functions
NIST Randomness Beacon API


**Deployment**

This project is designed to be deployed on Vercel.

->Push the project to GitHub

->Import the repository into Vercel

->Deploy

->The /api/entropy route will automatically work as a serverless function

**HAVE FUN**

https://quantum-art-generator.vercel.app/

