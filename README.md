# nonsense-waffle
A funny facebook mmo with random words and pointless texts


this is a bunch of notes I wrote for myself. It probably won't make much sense to you and is also out of date with
what I'm actually coding.

Nonsense:

Only two kinds of money/xp. XP will be called “non” and will be given upon most actions in the game like using votes or gaining votes on an entry you created. Non will be used like money to buy skills, more votes or anything other than the premium features.
Sense will be the dollars that can be used to buy premium features or anything that non can buy. You gain one per day as long as you log in. You gain a couple for every entry you make. You also gain a few if you successfully recruit one of your facebook friends. Most premium features are out of reach unless you purchase sense with real money.
Non will also be totaled, so you can tell how much non you have acquired in total. You will still gain levels like a regular rpg but those levels will do nothing, serve no purpose other than giving you a general idea of rank.

Premium features:
Unlock swear category
Unlock people category
Unlock banned content viewing (to see all the racist shit people post)
Buy any entry so that it’s featured on your profile and no one else is allowed to buy it unless they buy it from you… or some kind of mechanic like that
Pay to have your entry featured
Add text animation effects and transition
Grafitti another entry
Buy read to me feature
add a secret hot word in your entry that, when clicked will dispense coins

Standard features (available to everyone):
Post any entry to your facebook wall, others facebook wall.
Invite facebook friends (rewards with sense if the person signs up)
Do not force users to log into facebook until they actually attempt to do something that requires a user account.
Categories and tagging for entries
Favorite entries
Up/down voting
Invest in items with either non or sense.
Challenge one of your entries against a friend’s entry for votes and favorites. Gamble either non or sense.
Top user gets to choose the second word in the application name (like Nonsense waffle) so the name of the game with change
Automatically post to official nonsense twitter, facebook, reddit etc accounts.
Hire cheap artists to draw images of any entries.
Give sense bonus if user gets their entry illustrated.
Hot or not interface for “who would win in a fight”, who is funnier etc. tallies “battle points”, “humor points” etc
Battle points not shown until you challenge a friend
Some kind of google trends integration to get in popular words.

Viewing options:
Random
Friends entries
Top rated
Featured (paid)
Search by category (and later, tags)
Search by content/title
Favorites
My entries

Code:
Angular? Maybe meteor
Underscore?
Requires
NO jQuery!
Google app engine for php
Not sure about any php frameworks.
Facebook api


Dev plan
Items are listed in the order I should build them.

admin client to add words, including description, word variants and type
requires word collection/table

ability for users to sign in via facebook. Requires login/authorization for creating entries or voting etc, but NOT for viewing entries.
requires user collection/table

implement unit testing and keep up with it as you add new features

user cient build section with ability to load and display new words and add those words to the title.
text editor and submit button so users can submit their creation.
requires entry collection/table
User client build section has NOT implemented word variants, customizing of titles, notable security features (like enforcing maximums, title word checks or profanity filters), no categories or tags (but we have implemented choosing of words based on type --noun, verb, adjective, person)

View page contains simple randomized viewer with left and right buttons.
Add splunk logging that tracks all user actions
get people to play with the mechanics
add placeholder buttons for view page stuff
create intro to view page for when user first starts, shows everything for a couple seconds, then fades in a black background so all the user sees is the title and content of the first entry. then a right button shows after another couple seconds
Add up and down voting functionality (specific up and down votes will be attached to entry collection but user collection will have total count of up and down votes used)
Add favoriting functionality (list of favorited entry ids will be attached to user, but entry will have count of total people who have favorited it)
facebook sharing

figure out how to import entries and words from old google apps version (or do this earlier so you can feel better about yourself by using real content)

start trying to get a few sample people to use the app, do a focus group, maybe offer a few bucks to anyone who creates a funny entry

Lock production for a little while as you build the user profile page. Production site is still labeled as beta but open to anyone to try it out.

user stats tab will include star count and the main skills from the old google app engine version

implement gaining of stars via getting votes for your entries, via voting itself, via looking at an entry for more than 10 seconds and via creating an entry

implement limits on voting and words (no limits on favoriting or viewing)

implement visual placeholders for paid currency and ways of manually acquiring that currency

paid naughty words feature

get currency through survey stuff

image upload with flickr or other API integration

Youtube upload

challenge entry vs entry, hot or not mechanics






