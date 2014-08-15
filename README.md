xbox_web - control Video Games on your (Linux) computer with your Smartphone!
=============

xbox_web uses [i2DX](https://github.com/dtinth/i2DX) as a base to provide simulated, web-controlled Xbox360 controllers on linux. No windows or OS X support, and there probably won't ever be. Sorry. Also, if you are interested in different layouts, feel free to create them! It's quite simple, and you can look at [i2DX](https://github.com/dtinth/i2DX) for some more examples

Installation
===============

To get started, you need to install `xboxdrv`, `python-uinput` and `tornado`. Let's start with `xboxdrv`:

* Ubuntu / Debian / SteamOS
`$ sudo apt-get install xboxdrv'
* Arch
`$ sudo pacman -S xboxdrv`
And so on. Basically, use your package manager to get it.

Now, get the python dependencies:
`$ cd server`
`$ pip install -r requirements.txt`

Depending on your system, you'll probably need to add `sudo` in front of the `pip` command. So do that.

If the pip step still fails after that, you might need to
`$ sudo apt-get install libudev-dev`
Or whatever your distro's flavor of that looks like.

Getting started
============

Easy as pie! Simply run
`$ python2 server/xbox_web.py`
and connect a web browser to `http://<your-ip>:9876`. You'll get a menu that lets you pick a controller layout (currently, there's only `360-lite`) and skin, as well as which player you are.
Right now, you can only pick 1-4, and yes, that means multiple people can controle one controller. Hijinks may very much ensue.