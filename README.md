Bluez D-Bus
===========


Easy to use Node.js Bluez5 D-Bus library.


## Install

Required Packages for [dbus](https://github.com/Shouqun/node-dbus):
- libglib2.0-dev
- libdbus-1-dev

```
npm install bluez
```

## Usage

```js
const Bluez = require('bluez');
const bluetooth = new Bluez();

// Register callback for new devices
bluetooth.on('device', async (address, props) => {
    console.log("[NEW] Device:", address, props.Name);
    const dev = await bluetooth.getDevice(address);
    dev.on("PropertiesChanged", (props) => {
        console.log("[CHG] Device:", address, props);
    });
});

bluetooth.init().then(async () => {
    // listen on first bluetooth adapter
    const adapter = await bluetooth.getAdapter();
    await adapter.StartDiscovery();
    console.log("Discovering");
}).catch(console.error);
```

Custom Agents and Profiles can be implemented by extending Agent / Profile base classes.
Then use `bluez.registerAgent(agent, capability)` and `bluez.registerProfile(profile, options)` to activate them.

#### Permissions

Make sure the user that is running the node process has the necessary permissions for Bluetooth and System-DBus.
- on some Systems there is a `bluetooth` group.
- also check AppArmor and Polkit permissions.

#### Examples

Have a look at the [examples](examples) for more detailed usage information.

#### Tested with

- Bluez 5.50 Ubuntu 18.04
- Bluez 5.53 Ubuntu 20.04
- Bluez 5.48 Debian Stretch
- Bluez 5.50 Debian Buster
- Bluez 5.54 Debian Sid

Older Bluez version should work, but might miss some functions.
However I can not recommend using GATT with Bluez < 5.48.

## Migration

#### 0.3.x -> 0.4

- Characteristic Values are now always `Buffers`
- Characteristic, Descriptor and Service properties where changed to functions
- RawFdSocket was removed and replaced by [bluetooth-socket](https://github.com/waeco/node-bluetooth-socket) module
- `Bluez.registerDummyAgent` was renamed to `Bluez.registerStaticKeyAgent` which takes a pin code as argument
- `Bluez.getAllDevicesAddresses` was renamed to `Bluez.getAllDevicesProps` which returns all properties not only the address.

## API

This package mostly reflects the Bluez-DBus API. You can find its documentation [here](https://git.kernel.org/pub/scm/bluetooth/bluez.git/tree/doc/).

#### Bluez

Contains most management functions.

##### `constructor(options?: BluezOptions): Bluez`

*options*:
- `bus: DBus | undefined`: an existing DBus connection. Default: create new connection
- `service: DBus.Service | string | null | undefined`: service where to register default Profiles / Agents. Default: null (connection local service)
- `objectPath: string | undefined`: object path where to register default Profiles / Agents. Default: "/org/node/bluez"


##### `init(): Promise<void>`

Initializes DBus and interfaces. **MUST** be called befor any bluetooth interaction is done.
Attach device event listeners first, because calling *init()* will emit device events for paired devices.

##### `registerProfile(profile: Profile, options: ProfileOptions): Promise<void>`

Registers a Profile Bluetooth Service.

For available options see [Bluez Docs](https://git.kernel.org/pub/scm/bluetooth/bluez.git/tree/doc/profile-api.txt).

##### `registerAgent(agent: Agent, capabilities: string): Promise<void>`

Registers a Agent required for pairing.

For available options see [Bluez Docs](https://git.kernel.org/pub/scm/bluetooth/bluez.git/tree/doc/agent-api.txt).

##### `getDevice(address: string): Promise<Device|null>`

Returns a *Device* for a given address.

*address* can be a adress in format `XX:XX:XX:XX:XX:XX` or `XX_XX_XX_XX_XX_XX` or `/org/bluez/hciX/dev_XX_XX_XX_XX_XX_XX`


##### `findDevice(filterCb: (props: DeviceProps) => boolean): Promise<Device|null>`

Search for a *Device* given a custom filter function

##### `getAdapter(name?: string): Promise<Device>`

Returns a *Adapter* either by name or of not supplied the first one available.

##### `findAdapter(filterCb: (props: AdapterProps) => boolean): Promise<Adapter|null>`

Search for a *Adapter* given a custom filter function


##### Events

###### `on("device", address: string, props: DeviceProperties)`

Emitted if a device was discovered.

Note that for paired devices this will be emitted no matter if the devices are in range or not.

#### Adapter

An Adapter represents a local Bluetooth adapter.

##### `constructor(interface: DBus.Interface): Adapter`

*interface* is the DBus Interface corresponding the the Adapter.

Should not be called directly. Use `Bluez.getAdapter()`.


For available methods and properties see [Bluez Docs](https://git.kernel.org/pub/scm/bluetooth/bluez.git/tree/doc/adapter-api.txt).

#### Agent

An Agent is required for pairing with devices.

This default implementation accepts every pair request and has the passkey `1234`

##### `constructor(bluez: Bluez, DBusObject: DBus.ServiceObject): Agent`

*DBusObject* is the DBus Object under witch the interface should be registerd.


For available methods and properties see [Bluez Docs](https://git.kernel.org/pub/scm/bluetooth/bluez.git/tree/doc/agent-api.txt).

#### Device

A Device represents a remote Bluetooth device.

For available methods and properties see [Bluez Docs](https://git.kernel.org/pub/scm/bluetooth/bluez.git/tree/doc/device-api.txt).

##### `constructor(interface: DBus.Interface): Device`

*interface* is the DBus Interface corresponding the the Device.

Should not be called directly. Use `Bluez.getDevice()`.

##### `getService(uuid: string): Promise<Service | null>`

Get a GATT Service of the Device.



#### Service

For available methods and properties see [Bluez Docs](https://git.kernel.org/pub/scm/bluetooth/bluez.git/tree/doc/gatt-api.txt).

##### `getCharacteristic(uuid: string): Promise<Characteristic | null>`

Get a GATT Characteristic of the Service.

#### Characteristic

For available methods and properties see [Bluez Docs](https://git.kernel.org/pub/scm/bluetooth/bluez.git/tree/doc/gatt-api.txt).

##### `getDescriptor(uuid: string): Promise<Descriptor | null>`

Get a GATT Descriptor of the Characteristic.

#### Descriptor

For available methods and properties see [Bluez Docs](https://git.kernel.org/pub/scm/bluetooth/bluez.git/tree/doc/gatt-api.txt).



#### Profile

A Profile is a service provided by this Bluetooth device.

##### `constructor(bluez: Bluez, DBusObject: DBus.ServiceObject): Profile`

*DBusObject* is the DBus Object under witch the interface should be registerd.

For available methods and properties see [Bluez Docs](https://git.kernel.org/pub/scm/bluetooth/bluez.git/tree/doc/profile-api.txt).

#### SerialProfile

A Profile implementation for Serial communication.

##### `constructor(bluez: Bluez, DBusObject: DBus.ServiceObject, listener: (device: Device, socket: RawFdSocket)=>void): SerialProfile`

*listener* is a callback that is called for each new connection to the Profile. Its *socket* parameter is the established channel between the two devices.


## TODO

- Complete the API docs
- More examples
- Tests
- GATT Peripheral Services
