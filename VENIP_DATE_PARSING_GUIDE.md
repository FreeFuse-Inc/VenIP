# VenIP Assistant - Enhanced Date Parsing Guide

## 🎯 Overview
The VenIP Assistant now supports comprehensive date parsing for event creation and deletion. You can create or delete events for **any day, month, and year** using natural language.

---

## ✅ Supported Date Formats

### Relative Dates
- **"today"** → Uses today's date
- **"tomorrow"** → Uses tomorrow's date
- **"next Monday"** (or any day) → Uses the next occurrence of that weekday
- **"next week"** → Uses 7 days from today
- **"next month"** → Uses the same day next month
- **"this year"** → Current year (for combining with other dates)
- **"next year"** → Following year (for combining with other dates)

### Month & Day Formats
- **"March 15"** → March 15 of current or specified year
- **"Mar 15"** → Short month abbreviation
- **"March 15 2026"** → With explicit year
- **"the 15th of March"** → Written format
- **"the 15th"** → Day of current month (if only day is given)
- **"15"** → Day of current month

### Numeric Formats
- **"3/15"** → MM/DD format (current year)
- **"3/15/2026"** → MM/DD/YYYY format
- **"2026-03-15"** → ISO format YYYY-MM-DD

---

## 📝 Example Commands

### Creating Events

#### Tomorrow
```
"Create an event tomorrow called VenIP Tech Demo"
```
**Result**: Event created for tomorrow's date

#### Specific Date
```
"Create VenIP Tech Demo on March 15 2026"
```
**Result**: Event created for March 15, 2026

#### Next Occurrence
```
"Create an event next Friday called Product Launch"
```
**Result**: Event created for the next Friday (automatically calculated)

#### Multiple Formats
```
"I want to create an event on 3/20/2026 called Q2 Planning"
"Create new event March 20 2026 for VenIP Summit"
"Create event on the 20th of March 2026 named VenIP Summit"
```

### Deleting Events

#### Delete by Date
```
"Delete the event tomorrow"
"Delete events on March 15 2026"
"Delete all events next Friday"
```
**Result**: Event(s) deleted from specified date

#### Delete by Name
```
"Delete VenIP Tech Demo"
"Remove the VenIP Tech Demo event"
```
**Result**: Event deleted by name (searches all dates if name matches)

#### Delete by Name & Date
```
"Delete VenIP Tech Demo on March 15 2026"
"Remove VenIP Tech Demo from next Friday"
```
**Result**: Event deleted matching both criteria

---

## 🔍 How Date Parsing Works

The system parses dates in this priority order:

1. **Year Specification** - Checks for explicit year (e.g., "2026")
2. **"Today" Keyword** - Returns today's date
3. **"Tomorrow" Keyword** - Returns tomorrow's date
4. **"Next [Day]" Pattern** - Returns next occurrence (Monday, Friday, week, month)
5. **ISO Format** - YYYY-MM-DD format
6. **Month & Day** - Full or abbreviated month name with day
7. **Slash Format** - MM/DD or MM/DD/YYYY format
8. **"The Xth" Pattern** - Written format like "the 15th" or "the 15th of March"
9. **Default** - If no date specified, uses today's date

---

## ⚡ Quick Reference

| User Request | Parsed As | Example |
|---|---|---|
| "tomorrow" | Tomorrow's date | 2025-11-13 |
| "March 15" | March 15 current year | 2025-03-15 |
| "March 15 2026" | March 15, 2026 | 2026-03-15 |
| "next Friday" | Next Friday's date | 2025-11-14 |
| "3/15/2026" | MM/DD/YYYY format | 2026-03-15 |
| "the 15th" | 15th of current month | 2025-11-15 |
| "2026-03-15" | ISO format | 2026-03-15 |
| no date specified | Today's date | 2025-11-12 |

---

## 🎓 Natural Language Examples

### Good Commands ✅
- "Create VenIP Tech Demo tomorrow"
- "Create event March 15 2026 called Product Launch"
- "Create an event for next Friday named VenIP Summit"
- "Delete the event tomorrow"
- "Delete VenIP Tech Demo from March 15 2026"
- "Create event on 3/20/2026 named Q2 Planning"

### Natural Variations ✅
These will all work:
- "Create a new event tomorrow called VenIP Tech Demo"
- "I want to create an event tomorrow for VenIP Tech Demo"
- "Please create an event on March 15, 2026 named VenIP Tech Demo"
- "Delete the VenIP Tech Demo event from March 15 2026"
- "Can you remove the event tomorrow?"

---

## 🚀 Advanced Usage

### Year Handling
If you specify a year with any date format, it overrides the current year:
```
"Create event on March 15 2026"  → 2026-03-15
"Create event March 2026"         → Uses smart year inference
"Create event 3/15/2026"          → 2026-03-15
```

### Weekday Calculation
"Next [Day]" automatically calculates:
- If the day hasn't occurred this week → next occurrence
- If the day already passed → moves to next week
```
If today is Monday, November 12:
- "next Monday" → November 19, 2025
- "next Friday" → November 15, 2025 (only 3 days away)
- "next week" → November 19, 2025
```

### Combined Criteria
For deletion, you can specify both name and date:
```
"Delete VenIP Tech Demo from March 15 2026"
  → Deletes only if event is named "VenIP Tech Demo" AND on March 15, 2026
```

If only date is specified:
```
"Delete event on March 15 2026"
  → Deletes ANY event on that date
```

If only name is specified:
```
"Delete VenIP Tech Demo"
  → Deletes event by that name, regardless of date
```

---

## ✨ Tips & Tricks

1. **Be Specific with Years** - If creating far-future events, always include the year
   ```
   ✅ "Create event March 15 2026 for VenIP Tech Demo"
   ❌ "Create event March 15 for VenIP Tech Demo" (assumes current year)
   ```

2. **Use Natural Phrases** - The system understands conversational language
   ```
   ✅ "I'd like to create an event tomorrow called VenIP Tech Demo"
   ✅ "Can you create VenIP Tech Demo for tomorrow?"
   ✅ "Create VenIP Tech Demo - tomorrow"
   ```

3. **Combine Date Formats** - Mix formats as needed
   ```
   ✅ "Create event on 3/15/2026"
   ✅ "Create event March 15 2026"
   ✅ "Create event on the 15th of March 2026"
   ```

4. **Explicit Commands** - For deletion, be clear about intent
   ```
   ✅ "Delete VenIP Tech Demo"
   ✅ "Delete the event tomorrow"
   ✅ "Remove event from March 15"
   ❌ "Cancel VenIP" (too vague)
   ```

---

## 🔧 Troubleshooting

### Event Not Created for Specified Date
- **Issue**: Event created for wrong date
- **Solution**: Check that the date format is recognized. Try using a different format (e.g., "March 15 2026" instead of "3/15/2026")

### Delete Returned "No Events Found"
- **Issue**: Event exists but wasn't deleted
- **Solution**: 
  - Verify the event name exactly (case-insensitive match should work)
  - Try specifying just the date: "Delete event on [date]"
  - Check that the date format is correct

### Ambiguous Date Parsing
- **Issue**: System interpreted date differently than intended
- **Solution**: Use explicit year: "March 15 2026" or ISO format: "2026-03-15"

---

## 📊 Current Limitations

- **No Relative Offsets**: Cannot use "+5 days" format (use specific dates instead)
- **No Time Support**: Events are date-only, no specific times
- **Timezone Aware**: Dates use system timezone

---

## ✅ What Changed

This enhanced version now:
- ✅ Supports "tomorrow" and weekday-relative dates
- ✅ Handles year specifications (2026, "next year")
- ✅ Works with multiple date formats simultaneously
- ✅ Improves date parsing for natural language
- ✅ Better feedback on parsed dates
- ✅ Supports deletion by date and/or event name
- ✅ Automatic calendar date calculation

---

## 🎯 Summary

You can now tell VenIP Assistant to:
- ✅ Create events for **any future date** (tomorrow, next Friday, March 15 2026, etc.)
- ✅ Use **multiple date formats** (written, numeric, ISO)
- ✅ Delete events by **date, name, or both**
- ✅ Specify **year explicitly** for long-term planning
- ✅ Use **natural conversational language**

**All date formats are now supported and work correctly!**
