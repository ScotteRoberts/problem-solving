# Break Time

## Reqirements

- Create a running log of active users in Discord voice chats. If that is too hard, you can use the user's discord status as a backup measure.
- Message users after a configurable period of time that they need to take a break
  - Offer something constructive to do while they take a break
  - Respect the DND (Do Not Disturb) status
- This service should run all the time, but messages can be shut off by the owner/admins of the server in some way.
- Users should be able to interact with the service to see how long other users in the Discord server have been online. 
  - Can be made into a leaderboard of some kind (if you are feeling adventurous)

## Design

Create a discord bot that can monitor a user's presence update.
- If they are online, you can enter a datetime of when they went online.
- If they are offline, you can reset the timer

Database considerations:
- Service needs to be refreshed, but downtime of the service resets the timer on individuals

## Implementation

There are a few technologies that I want to learn/practice to use while making this bot.

- Deno
- Discord APIs
- Docker
- Fly.io (hosting service)

## Testing

There are a few Discord servers that I belong to to test functionality. 
- Can get user feedback on timing of messages/annoyance of the project

Mock a user going online and then going offline to see if the timeframe calculation is correct.

## Signoff

Discord server owners install the bot and allow it to message users.