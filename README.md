# Flashback Browser Extension

# 1. Inspiration
In this era of online education, we have gone completely digital from writing our notes to making projects that have been evaluated by our teachers. Hence we also need to find a digital way of tracking our learning and the shortcoming that we face while learning a topic of the subject. At the end of the week, we tend to forget about the tasks or the topics we have learned. Here comes the web-extension flashback which provides you with the necessary tools to manage your leanings on a weekly basis. 


# 2. What it does(problem statement)
A web browser extension for representing your work done on a weekly basis so that you can find your work, stay more productive, and understand your shortcomings in the journey of learning about a new Tech Stack or working on an existing project. It also helps to look back on your previous week's learning and the issues which still need to be resolved. 



## Features
* It also helps to look back on your previous week's learning and the issues which still need to be resolved. 
* Synced with cloud, a user can access the data through web browser, through an app as well as through VS code extension making the data available within a fraction of time. 
* Voice dictation using google speech to text, so that a user can store ideas or issues on the go. 
* With the help of VS code extension it Tracks the coding time and code reading of the user and virtualises it, compares between time and code written to produce efficiency.
### Current

Contains all issues/tasks for current week as reflected in the header, e.g. `28 Mar - 4 April`. Dates of the current week are automatically updated as a new week starts, and the old week is automatically reflected as `Previous Week` in the Previous tab. Hence, this should always be the primary list to edit.

| Feature          | Description                                                                                                                     |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Add item         | Add new item to category                                                                                                        |
| Edit item        | Edit selected item with simple click                                                                                            |
| Delete item      | Delete item from list                                                                                                           |
| Drag & Drop item | Drag and drop items between categories                                                                                          |
| Copy             | Copy list to markdown-formatted text                                                                                            |
| Start new week   | Changes current week to one week into the future, pushing back the current week to Previous; capped at one week into the future |

### Previous

| Feature            | Description                                                                                                |
| ------------------ | ---------------------------------------------------------------------------------------------------------- |
| Current's features | All features in Current are applicable to individual weeks' lists, with the exception of starting new week |
| Copy all           | Copy all lists to markdown-formatted text, organized by dates                                              |

### Action Items

Contains all Yellow and Red items from all previous weeks' lists. Any changes reflected in previous weeks' items are reflected in this list while they still exist in this list.

| Feature                | Description                                        |
| ---------------------- | -------------------------------------------------- |
| Move to Current Green  | Moves action item to Current tab's Green category  |
| Move to Current Yellow | Moves action item to Current tab's Yellow category |
| Move to Current Red    | Moves action item to Current tab's Red category    |
| Resolve                | Removes item from Action Items list                |




# 4. What's next for Flashback
Adding the mobile notification feature (using Twilio), progress tracker, making a mobile app,
Voice dictation, a reminder at a particular time(defined by the user), See and add other's notes, vs code extension to track coding time. 



# 5. Challenges we ran into
Without facing and overcoming challenges, it is impossible to make victory.

1. We believe we managed to come up with a good executable idea and solution within
the time given to us.

2. We ultimately found a good and steady workflow. The time constraints were also
challenging, but we set achievable goals and accomplished all of what we set out to.

3. It was all of our first times using chrome storage API, and we were also generally
relatively new to React Contexts as a whole, so we took help from stackoverflow and other websites to hunt down the bugs.




# 6. Built With

● bootstrap
● CSS
● javascript
● react
● react-beautiful-dnd
● react-datepicker
● react-toastify
● redux
● shards-react


