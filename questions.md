## Accuracy

[ Must do ]
**1. How is time rounded to half-hour units?**
The feature says time is tracked in half-hour units, but it doesn't say what happens with 20 or 50 minutes worked. Is time rounded up, rounded down, rounded to the nearest unit, or rejected?

[ Must do ]
**2. What is the minimum and maximum time that can be entered?**
Can a user log 0 hours or a negative value to correct an earlier entry? Is there a cap per entry or per day, such as 24 hours? Without limits, the history may contain values that can't be true.

[ Must do ]
**3. When is the time recorded: the date worked or the date entered?**
To keep an accurate history, we need to know whether each entry has a work date. Can users enter time for past dates (backdating) or future dates?

[ keep to do in later ]
**4. What counts as a "specific project," and where does the list come from?**
Are projects chosen from a predefined list, or can users type free text? Free text could let "Project A" and "project-a" be stored as separate projects, which would make per-project totals wrong.

[ Must do ]
**5. How is "how much time I have spent" calculated and displayed?**
Should the history show hours as decimals (1.5) or as hours and minutes (1h 30m)? Should totals be shown per day, per week, or for the project's whole lifetime? The expected output needs to be defined before it can be tested.

## Consistency

[ Must do ]
**6. What exactly is a "timesheet," and what does "complete" mean?**
The story talks about tracking time against projects, but the feature talks about completing a timesheet. Is a timesheet a single entry, or a weekly sheet with many entries? Does "complete" mean saved, submitted, or locked?

[ Must do ]
**7. Can one timesheet include time for more than one project?**
The feature says "a project," singular, but the story's goal is a history across "individual projects." It needs to be clear whether one timesheet can hold several project/time pairs.

[ Keep to do in later ]
**8. Who else can see tracked time, if anyone?**
"Only I should be able to see my tracked time" may conflict with how timesheets are normally used, for example by managers, payroll, or admins. Is this rule absolute, or are there roles that are exempt? Is the same rule enforced in the UI, reports, exports, and the API?

[ Keep to do in later ]
**9. Can entries be edited or deleted after they're entered, and by whom?**
If users can change past entries, should the history keep a record of the change? Should the totals update right away? This affects whether the history stays consistent over time.

[ Must do ]
**10. Where else must the half-hour rule be enforced?**
Does the half-hour rule apply in every place time can be entered or changed, such as manual entry, edits, imports, and the API? It also needs to apply to every stored value, so that totals always come out as multiples of 0.5 hours.