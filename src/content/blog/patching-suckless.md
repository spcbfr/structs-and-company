---
title: "How to patch suckless programs"
description: "a personal cheatsheet for patching suckless programs"
pubDate: "Mar 28 2021"
archived: true
---

<span class="leadin">Suckless is a group of developers</span> who make programs that stick to the unix philosophy of _"doing one thing and doing it well"_. they have developed programs like dwm, dmenu and st, which are all minimal by design.

The main feature of suckless programs is the way they are configured. instead of having to edit a config file that has a weird syntax. you go and edit the source code of the actual program itself. that means that every different configuration of suckless programs is almost like a fork of the original project.

most of these programs are written in C. but you dont need to do every bit of code to configure suckless programs on your own because members of the community have made "patches", that you can download and add to your build. these patches do all sorts of things that wouldnt be easy to implement for most users. in this blogpost we will look into how to patch these programs and how to remove patches if you end up hating them.

> This is sort of a personal cheatsheet for me, because I always forget how to patch suckless stuff :)

first open the [suckless website](https:suckless.org) and find a program that you want to use and clone it. in this example I'll demonstrate using the dmenu tool which is an app launcher that can also do a bunch of other stuff

```shell
git clone https://git.suckless.org/dmenu
cd dmenu
```

next open the patches tab from the sidebar and find a patch you want to apply. for example i'll add a patch called [border](https:https://tools.suckless.org/dmenu/patches/border/) that adds a colored border to your dmenu prompt. to do that you will need to navigate to the patch page. find the download link and download it. I prefer to use `wget` but you can right click and choose save link as. make sure to download the file to the directory for your suckless program

```shell
wget https://tools.suckless.org/dmenu/patches/border/dmenu-border-20201112-1a13d04.diff
```

next is the most important step we will use the `patch` command to apply the patch to the program

```shell
patch -p1 < name-of-patch.diff
```

finally compile the code using the `make` command

```shell
sudo make install
```

