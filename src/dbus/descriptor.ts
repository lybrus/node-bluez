import * as DBus from 'dbus-next';
import { EventEmitter } from 'events';

/*
 * Generated by dbus-next interface generator
 */

/**
 * org.bluez.GattDescriptor1
 */
export class OrgBluezGattDescriptor1 extends EventEmitter {

    public readonly dbusInterfaceName = 'org.bluez.GattDescriptor1';
    public dbusObject: DBus.ProxyObject;
    public propertiesDBusInterface: DBus.ClientInterface;
    public thisDBusInterface: DBus.ClientInterface;

    constructor(dbusObject: DBus.ProxyObject) {
        super();
        this.dbusObject = dbusObject;
        this.thisDBusInterface = dbusObject.getInterface('org.bluez.GattDescriptor1');
        this.propertiesDBusInterface = dbusObject.getInterface('org.freedesktop.DBus.Properties');

        // forward property change events
        this.propertiesDBusInterface.on('PropertiesChanged', (iface: string, changed: any, invalidated: any) => {
            if (iface === this.dbusInterfaceName) {
                this.emit('PropertiesChanged', iface, changed, invalidated);
            }
        });
        // forward all signals
        this.on("newListener", this.thisDBusInterface.on.bind(this.thisDBusInterface));
        this.on("removeListener", this.thisDBusInterface.removeListener.bind(this.thisDBusInterface));
    }

    /***** Properties *****/

    public getProperties(): Promise<{ [name: string]: DBus.Variant }> {
        return this.propertiesDBusInterface.GetAll(this.dbusInterfaceName);
    }

    public getProperty(name: string): Promise<DBus.Variant> {
        return this.propertiesDBusInterface.Get(this.dbusInterfaceName, name);
    }

    public setProperty(name: string, value: DBus.Variant): Promise<DBus.Variant> {
        return this.propertiesDBusInterface.Set(this.dbusInterfaceName, name, value);
    }

    //@property({ name: 'UUID', signature: 's', access: ACCESS_READ })
    public UUID(): Promise<string> {
        return this.propertiesDBusInterface.Get(this.dbusInterfaceName, 'UUID');
    }

    //@property({ name: 'Characteristic', signature: 'o', access: ACCESS_READ })
    public Characteristic(): Promise<DBus.ObjectPath> {
        return this.propertiesDBusInterface.Get(this.dbusInterfaceName, 'Characteristic');
    }

    //@property({ name: 'Value', signature: 'ay', access: ACCESS_READ })
    public Value(): Promise<Buffer> {
        return this.propertiesDBusInterface.Get(this.dbusInterfaceName, 'Value');
    }


    /***** Methods *****/

    //@method({ name: 'ReadValue', inSignature: 'a{sv}', outSignature: 'ay' })
    public ReadValue(options: { [key: string]: DBus.Variant }, ): Promise<Buffer> {
        return this.thisDBusInterface.ReadValue(options);
    }

    //@method({ name: 'WriteValue', inSignature: 'aya{sv}', outSignature: '' })
    public WriteValue(value: Buffer, options: { [key: string]: DBus.Variant }): Promise<void> {
        return this.thisDBusInterface.WriteValue(value, options);
    }

}
/***** Signals for org.bluez.GattDescriptor1 *****/
export declare interface OrgBluezGattDescriptor1 {
    on(evt: "PropertiesChanged", cb: (iface: string, changedProperties: { [key: string]: any }, invalidatedProperties: string[]) => void): this;
    on(event: string, listener: Function): this;
}


