# Pretext

[[Linux Commands#cat|cat]] is a beginner friendly command to read the contents of files. 
Many people including my self don't know that [[Linux Commands#cat|cat]] is short for `concatenate`.

# Reading Files

[[Linux Commands#cat|cat]] has a very simple syntax that we can use.
```
cat [args] [file]
```
For this example, I will be using [[Linux Commands#cat|cat]] on one of the site files for my repo.
After running the following command, we can see it will print out the contents.
```Bash
alfredredbird@windows-PC:~/obsidain osint/CyberNotes/Cyber Notes (main!*) 24 files 
$ cat notesManifest.js 
const NOTES = [
  // Root
   {
    id: "readme",
    title: "Read Me",
    wikiName: "Read Me",
    path: "README.md",
    folder: ""
  },
...
...
```
The [[Linux Commands#cat|cat]] command also has special [[Termonology#UNIX|UNIX]] operators that allow us to do stuff.
We can use `>` to take the contents of the [[Linux Commands#cat|cat]] output and send it to a new file. 
```Bash
cat file1.txt > file2.txt
```
If we want to append and not overwrite we can use the `>>` operator.
```Bash
cat file1.txt >> existingfile.txt
```

# Display Options

To display contents with line numbers.
```Bash
cat -n file.txt
```
To remove blank lines:
```Bash
cat -s file.txt
```
To mark the end of each line with a _$_ symbol.
```Bash
cat -e file.txt
```
To display tab characters as _^I_.
```Bash
cat -T file.txt
```