# Arbitrary Meds Schedule

This is a script for Obsidian.MD's templater plugin, basically making a to-do list for a medication schedule that is arbitrary to when the command is run.

## Why does this exist?

I have a number of medications that can't be taken together, and that have to be taken throughout the day. Whenever my work/sleep schedule changes, my brain has to figure out how to fit these medications into a new 16-hour time block.

## How can this be used?

Its existence is solely do to a personal need of mine, if there was interest outside of this niche use case, I'd be happy to refactor it. I call the script by leaving it in my template that I use for my daily notes.

Currently, the medsArray lines up the schedule of medications to a 16-hour schedule starting with the hour the script is run (rounded to the nearest hour) and is the only way to directly interact with the items in the to-do list.

## Room for improvement

The current output meets my needs, but could be taken in a number of directions:
- Rolled into its own plugin, with customisable tasks.
- More intelligent sort behavior, maybe by rolling tasks into their own object with durations/exclusions.


# How to install

Move the .js file to wherever you place scripts.
Call the script from within a template by pasting: <% tp.user.arbitraryMedSchedule() %>
Note: Trigger Templater on new file creation provides for best results.
