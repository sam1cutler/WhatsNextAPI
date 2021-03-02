# Whats's Next? API

## General Description
This Express server serves as the API for the What's Next? React app, linking that app to a PostgreSQL database. You can find the Vercel-hosted app [here](https://whats-next-five.vercel.app/) and the app's GitHub repo [here](https://github.com/sam1cutler/WhatsNext). 

## Summary
This API includes 3 main endpoints: `/shows`, `/users`, and `/auth`. The latter two are responsible for maintaining and authenticating registered users of the app, respectively, and the `/shows` endpoint is responsible for the core functionality of the app. Users create lists of shows that they WANT to watch in the future and shows they HAVE ALREADY finished watching, as well as maintaining "friend" connections to other What's Next? users. The following information about shows can be saved:
- Show name
- Streaming service on which the show is available
- Show genre
- "Priority" rank (specific for shows on a user's "to-watch" list)
- Date completed (specific for shows on a user's "watched" list)
- Rating out of 5 stars (specific for shows on a user's "watched" list)

## Technology used
Express, PostgreSQL, Heroku, Morgan, Helmet. 

## Contact me
You can find [my GitHub page here](https://github.com/sam1cutler).

## Acknowledgements
This project is part of an assignment for the Thinkful software engineering program. 