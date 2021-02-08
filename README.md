# vsc-sort-import README

Thanks to [Renke Grunwald](https://github.com/renke)'s [nice work](https://github.com/renke/import-sort), it really save me a lot of time so that I can easily make this.

## Features

No any more features, no configuration, just sort!

## Sorting Order

Firstly, NodeJS built-in module imports have most priority, and then, imports are grouped by the module hierarchy. Imports farther away from the current directory have higher priority.

Be attention, the absolute imports are always farther than relative imports.

Before:

```javascript
import foo from "./foo";
import _ from "lodash";
import foobar from "../foobar";
import fs from "fs";
```

After:

```javascript
import fs from "fs"; // built-in module
import _ from "lodash"; // absolute module
import foobar from "../foobar"; // farther module
import foo from "./foo";
```

modules having same hierarchy compose a group. For each group, the order is:

1.  imports which have only namespace member
    eg: `import * as fs from 'fs'`
2.  imports which have only default member
    eg: `import fs from 'fs'`
3.  imports which have both default and namespace member
    eg: `import foo, * as bar from 'foobar'`
4.  imports which have both default and named member
    eg: `import foo, { bar } from 'foobar'`
5.  imports which have only named member
    eg: `import { foo, bar } from 'foobar'`

If the above rule didn't determine the order, then use the first member's name (not alias) to compare. For namespace member, the alias is regarded as its name. The comparison rule is:

1. literal that starts with non-alphanumeric has higher priority
2. then follow the alphabetical order(in unicode)

For imports having no member, sort them by module name with same rule.

## Extension Settings

None.

## Usage

This didn't be published to extension marketplace since it doesn't suitable for most people. So you have to install manually.

- download VSIX file from [Github release](https://github.com/mattuylee/vsc-sort-import/releases)
- in vscode, `Ctrl+Shift+P` and input "Install from VSIX..."
- select downloaded VSIX file, then install
- enjoy

## Build

clone this repo:
> `git clone https://github.com/mattuylee/vsc-sort-import`

change into repo directory and install dependencies:
> `cd vsc-sort-import && npm install`

package VSIX file:
> `npx vsce package`

## Debug

After install dependencies, just press `F5` to start debugging. If some error occurs, it will be printed onto the output panel.
