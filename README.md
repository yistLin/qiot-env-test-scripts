# QIoT Environment Testing Scripts

### Create Users

To create users, you have to modify:

- nasIp
- nasPort
- adminUsername
- adminPassword
- numberOfUsers

in *config.js*. After that, simply run,

```bash
node createUsers.js
```

Then the specified number of users will be created and all have the same password: **password**.
