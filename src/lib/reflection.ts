/**
 * @class ReflectionClass
 * @description A class to provide reflection-like capabilities for JavaScript objects and classes, now with TypeScript.
 */
export class ReflectionClass<T extends object | Function> {
  /**
   * @type {T}
   * @private
   * The target being reflected. If it's an instance, _target is the instance.
   * If it's a class constructor, _target is the constructor itself.
   */
  private _target: T;

  /**
   * @type {Function}
   * @private
   * The constructor function. If target is an instance, this is target.constructor.
   * If target is a class constructor, this is target.
   */
  private _constructorFn: Function;

  /**
   * @type {object|null}
   * @private
   * The prototype object of the class.
   */
  private _prototype: object | null;

  /**
   * Creates an instance of ReflectionClass.
   * @param {T} target - The class constructor or object instance to reflect upon.
   * @throws {TypeError} If the target is not a function or an object.
   */
  constructor(target: T) {
    if (typeof target !== 'function' && typeof target !== 'object') {
      throw new TypeError(
        'Target must be a class constructor or an object instance.'
      );
    }

    this._target = target;
    this._constructorFn =
      typeof target === 'function' ? target : (target as any).constructor;
    this._prototype =
      typeof target === 'function'
        ? (target as any).prototype
        : Object.getPrototypeOf(target);
  }

  /**
   * Gets the name of the class.
   * @returns {string} The name of the class.
   */
  getName(): string {
    return (this._constructorFn as any).name || '[Anonymous]';
  }

  /**
   * Gets the constructor function of the reflected class/object.
   * @returns {Function} The constructor function.
   */
  getConstructor(): Function {
    return this._constructorFn;
  }

  /**
   * Gets the prototype object of the class.
   * @returns {object|null} The prototype object.
   */
  getPrototype(): object | null {
    return this._prototype;
  }

  /**
   * Gets the parent class (constructor function) if it exists.
   * @returns {Function|null} The parent class constructor or null if no parent.
   */
  getParentClass(): Function | null {
    if (!this._prototype) return null;
    const parentPrototype = Object.getPrototypeOf(this._prototype);
    return parentPrototype ? parentPrototype.constructor : null;
  }

  /**
   * Gets the name of the parent class.
   * @returns {string|null} The name of the parent class or null.
   */
  getParentClassName(): string | null {
    const parentClass = this.getParentClass();
    return parentClass ? (parentClass as any).name || '[Anonymous]' : null;
  }

  /**
   * Checks if the reflected target is a class (i.e., a function that can be a constructor).
   * @returns {boolean} True if the target is a class constructor.
   */
  isClass(): this is ReflectionClass<Function> {
    return typeof this._target === 'function';
  }

  /**
   * Checks if the reflected target is an instance of an object.
   * @returns {boolean} True if the target is an object instance.
   */
  isInstance(): this is ReflectionClass<object> {
    return typeof this._target === 'object' && this._target !== null;
  }

  /**
   * Gets own properties of the class (static properties) or instance.
   * Does not include properties from the prototype chain.
   * @returns {string[]} An array of own property names.
   */
  getOwnProperties(): string[] {
    return Object.getOwnPropertyNames(this._target);
  }

  /**
   * Gets all properties of the class (static properties) or instance, including inherited ones.
   * @returns {string[]} An array of all property names.
   */
  getProperties(): string[] {
    const props = new Set<string>();
    let current: any = this._target;
    // For instances, we iterate up the prototype chain from the instance itself
    // For classes (constructors), we iterate up the prototype chain from the constructor itself (for static inherited props)
    while (
      current !== null &&
      current !== Object.prototype &&
      current !== Function.prototype
    ) {
      Object.getOwnPropertyNames(current).forEach((prop) => props.add(prop));
      current = Object.getPrototypeOf(current);
    }
    return Array.from(props);
  }

  /**
   * Gets own methods of the class (static methods) or instance.
   * For instances, it gets methods directly defined on the instance's prototype.
   * For classes, it gets static methods defined directly on the class.
   * @returns {string[]} An array of own method names.
   */
  getOwnMethods(): string[] {
    const target = this.isClass() ? this._target : this._prototype;
    if (!target) return [];
    return Object.getOwnPropertyNames(target).filter((prop) => {
      try {
        return typeof (target as any)[prop] === 'function' && prop !== 'constructor';
      } catch (e) {
        // Property access might be restricted
        return false;
      }
    });
  }

  /**
     * Gets all methods of the class or instance, including inherited ones.
     * For instances, this includes methods from its prototype chain and own instance methods.
     * For classes, this includes static methods from its prototype chain (inheritance via extends).
     * @returns {string[]} An array of all method names.
     */
  getMethods(): string[] {
    const methods = new Set<string>();
    let currentProto: any = this.isClass() ? this._target : this._prototype; // Start with prototype for instances, or class itself for static

    // Iterate prototype chain for instance methods (from prototype) or static methods (from class and its ancestors)
    while (
      currentProto &&
      currentProto !== Object.prototype &&
      currentProto !== Function.prototype
    ) {
      Object.getOwnPropertyNames(currentProto).forEach((prop) => {
        if (prop !== 'constructor') {
          try {
            if (typeof currentProto[prop] === 'function') {
              methods.add(prop);
            }
          } catch (e) {
            // Access might be restricted
            // console.error(`Error accessing property ${prop} on prototype:`, e);
          }
        }
      });
      currentProto = Object.getPrototypeOf(currentProto);
    }

    // If reflecting an instance, also check for methods directly on the instance itself
    if (this.isInstance()) {
      const instanceTarget = this._target as object; // Explicitly use the instance
      const instanceKeys = Object.getOwnPropertyNames(instanceTarget);
      for (const key of instanceKeys) {
        try {
          const value = (instanceTarget as any)[key];
          if (typeof value === 'function') {
            methods.add(key);
          }
        } catch (e) {
          // This catch is for safety, though not expected to be hit for simple function properties
          // console.error(`Error accessing property ${key} on instance:`, e);
        }
      }
    }
    return Array.from(methods).sort();
  }
  /**
   * Checks if the class/object has a specific own property.
   * @param {string} name - The name of the property.
   * @returns {boolean} True if the property exists as an own property.
   */
  hasOwnProperty(name: string): boolean {
    return Object.prototype.hasOwnProperty.call(this._target, name);
  }

  /**
   * Checks if the class/object has a specific property (including prototype chain).
   * @param {string} name - The name of the property.
   * @returns {boolean} True if the property exists.
   */
  hasProperty(name: string): boolean {
    return name in this._target;
  }

  /**
   * Checks if the class/object has a specific own method.
   * For instances, checks methods on its prototype. For classes, checks static methods.
   * @param {string} name - The name of the method.
   * @returns {boolean} True if the method exists as an own method.
   */
  hasOwnMethod(name: string): boolean {
    const target = this.isClass() ? this._target : this._prototype;
    if (!target) return false;
    return (
      Object.prototype.hasOwnProperty.call(target, name) &&
      typeof (target as any)[name] === 'function'
    );
  }

  /**
   * Checks if the class/object has a specific method (including prototype chain).
   * @param {string} name - The name of the method.
   * @returns {boolean} True if the method exists.
   */
  hasMethod(name: string): boolean {
    const initialTarget = this.isClass() ? this._target : this._prototype;
    if (!initialTarget) return false;

    let current: any = initialTarget;
    while (
      current &&
      current !== Object.prototype &&
      current !== Function.prototype
    ) {
      if (
        Object.prototype.hasOwnProperty.call(current, name) &&
        typeof current[name] === 'function'
      ) {
        return true;
      }
      current = Object.getPrototypeOf(current);
    }
    // For instances, also check if the method is directly on the instance itself
    if (
      this.isInstance() &&
      typeof (this._target as any)[name] === 'function' &&
      Object.prototype.hasOwnProperty.call(this._target, name)
    ) {
      return true;
    }
    // For classes, check static methods up the chain (already covered by initialTarget logic if _target is class)
    // The loop for static methods on classes was a bit redundant if initialTarget is already this._target
    // The initial loop starting with `this._target` for classes should cover static inherited methods.

    return false;
  }

  /**
   * Checks if the reflected target (class) is instantiable.
   * @returns {boolean} True if the target is a function (and thus potentially a class constructor).
   */
  isInstantiable(): this is ReflectionClass<new (...args: any[]) => any> {
    // A more robust check might involve checking if it's a class declaration
    // or a function that doesn't throw when called with 'new'.
    // For simplicity, we consider any function instantiable.
    // The type guard `this is ReflectionClass<new (...args: any[]) => any>` helps TypeScript understand.
    return typeof this._target === 'function';
  }

  /**
   * Creates a new instance of the reflected class.
   * @param {...any} args - Arguments to pass to the class constructor.
   * @returns {object|null} A new instance of the class, or null if the target is not instantiable.
   * @throws {TypeError} If the target is not a constructor.
   */
  newInstance(...args: any[]): object | null {
    if (!this.isInstantiable()) {
      // Or throw new TypeError(`${this.getName()} is not instantiable.`);
      return null;
    }
    // The type guard from isInstantiable should ensure _target is a constructor type.
    // However, to be absolutely safe with TypeScript's strictness:
    const Constructor = this._target as new (...args: any[]) => any;
    try {
      return new Constructor(...args);
    } catch (e: any) {
      // Catch potential runtime errors if it's not truly a constructor (e.g. arrow function)
      throw new TypeError(`${this.getName()} is not a constructor or cannot be instantiated: ${e.message}`);
    }
  }

  /**
   * Checks if a given object is an instance of the reflected class.
   * This is only meaningful if the reflected target is a class constructor.
   * @param {object} obj - The object to check.
   * @returns {boolean} True if obj is an instance of the reflected class.
   * @throws {Error} If the reflected target is not a class constructor.
   */
  isInstanceCheck(obj: any): boolean {
    if (!this.isClass() || !(this._constructorFn instanceof Function)) {
      throw new Error(
        `Cannot perform instance check: ${this.getName()} is not a class constructor.`
      );
    }
    return obj instanceof (this._constructorFn as any); // Cast to 'any' or a specific constructor type
  }

  /**
   * Returns a string representation of the reflected class/object.
   * @returns {string} A string describing the reflected entity.
   */
  toString(): string {
    return `ReflectionClass for [${this.isClass() ? 'Class' : 'Object'
      }: ${this.getName()}]`;
  }
}
