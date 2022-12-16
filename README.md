# What is it

This app allow you to right click some links on website and immediately save them into appropriate google sheets

# Why

I've created it coz like to save those links "for later" (later usually never come), in other words I'm hoarder. Without app, I just opened all of those links in new tabs - plan was to come back, when I have time, and store all those links in google sheets and close those tabs, but.. there are never "have time". So I had dozens and dozens of open tabs. With app ON, I just save that links without even opening them. Perfect!

# How does it work

App consists of 2 parts: tampermonkey plugin and local server:

### Tampermonkey plugin

You create a new script in your tampermonkey dashboard, copy there everything  from `tampermonkeyCode.js`
and replace `<PUT_tables.json_CONTENT_HERE>` and `<PUT_HERE_VALUE_FROM_.env_FILE>` with corresponding values.
To get `tables.json` file, just rename `tables.ts.REMOVE_THIS_PART` and update it content to your needs. To get `.env` file, rename `.env.REMOVE_THIS_PART` (you don't need most of fields in this file, however)


![plot](./tampermonkeyMenuExample.png)


If you never used tampermonkey before, start from something easier, like create a script with simple alert or console.log and make sure it works on your pages. Then try script from link-saver


For working with Google Sheets:
- https://developers.google.com/sheets/api
- https://developers.google.com/sheets/api/guides/values#node.js

Where to get spreadsheetId: