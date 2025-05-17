# @devalade/reflection

[![npm version](https://badge.fury.io/js/%40devalade%2Freflection.svg)](https://badge.fury.io/js/%40devalade%2Freflection)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub repository](https://img.shields.io/badge/GitHub-View%20Repository-blue?logo=github)](https://github.com/devalade/reflection)

A powerful and intuitive TypeScript/JavaScript library for performing reflection on classes and objects. This utility allows you to introspect and understand the structure of your code at runtime, providing capabilities similar to reflection APIs in languages like Java or PHP.

## Features

* **Class and Instance Introspection:** Analyze both class constructors and object instances.
* **Detailed Information:** Retrieve names, constructors, prototypes, and parent classes.
* **Property Discovery:** Get lists of own properties, all properties (including inherited).
* **Method Discovery:** Get lists of own methods, all methods (including inherited and instance-specific).
* **Type Checking:** Check if a target is a class or an instance.
* **Instantiation:** Create new instances of reflected classes.
* **Type Safe:** Written in TypeScript for enhanced developer experience and safety.
* **ES Module First:** Designed with ES Modules in mind, aligning with modern JavaScript practices.
* **Comprehensive API:** Offers a wide range of methods for detailed reflection.

## Installation

Install the package using your preferred package manager:

```bash
npm install @devalade/reflection
yarn add @devalade/reflection
pnpm add @devalade/reflection

```

### Usage
This package is distributed as an ES Module.
```typescript

// TypeScript / ES Modules
import { ReflectionClass } from '@devalade/reflection';

class MyExampleClass {
  public greeting: string;
  private secret: number;

  constructor(greeting: string) {
    this.greeting = greeting;
    this.secret = 42;
  }

  greet(): string {
    return this.greeting;
  }

  static staticMethod(): string {
    return "I am static!";
  }

  private privateMethod(): number {
    return this.secret;
  }
}

// Reflecting the class itself
const reflectMyClass = new ReflectionClass(MyExampleClass);

console.log('Class Name:', reflectMyClass.getName());
// Output: MyExampleClass

console.log('Is it a class?', reflectMyClass.isClass());
// Output: true

console.log('Own Static Methods:', reflectMyClass.getOwnMethods());
// Output: ['staticMethod'] (order may vary)

console.log('Can it be instantiated?', reflectMyClass.isInstantiable());
// Output: true

// Creating a new instance
try {
  const instance = reflectMyClass.newInstance('Hello Reflection!') as MyExampleClass;
  if (instance) {
    console.log('Instance Greeting:', instance.greet());
    // Output: Hello Reflection!

    // Reflecting the instance
    const reflectInstance = new ReflectionClass(instance);
    console.log('Instance\'s Class Name:', reflectInstance.getName());
    // Output: MyExampleClass

    console.log('Instance Own Properties:', reflectInstance.getOwnProperties());
    // Output: ['greeting', 'secret'] (order may vary)

    console.log('Instance All Methods (including prototype):', reflectInstance.getMethods());
    // Output: ['greet', 'privateMethod'] (order may vary, plus methods from Object.prototype if not filtered)
  }
} catch (error) {
  console.error('Failed to create instance:', error);
}
```

#### API Overview
The `ReflectionClass<T>` takes a target T (which can be a class constructor or an object instance) in its constructor.

Core Methods
constructor(target: T): Initializes the reflection for the given target.

- `getName()`: string: Gets the name of the class.

- `getConstructor()`: Function: Gets the constructor function.

- `getPrototype()`: object | null: Gets the prototype object of the class.

- `getParentClass()`: Function | null: Gets the parent class constructor.

- `getParentClassName()`: string | null: Gets the name of the parent class.

- `isClass()`: boolean: Checks if the reflected target is a class constructor.

- `isInstance()`: boolean: Checks if the reflected target is an object instance.

Property Introspection
- `getOwnProperties()`: string[]: Gets an array of own property names (static for classes, instance-specific for objects).

- `getProperties()`: string[]: Gets an array of all property names, including inherited ones (static for classes, instance and prototype chain for objects).

- `hasOwnProperty(name: string)`: boolean: Checks if the target has a specific own property.

- `hasProperty(name: string)`: boolean: Checks if the target has a specific property (including the prototype chain).

Method Introspection
- `getOwnMethods()`: string[]:

For classes: Gets own static methods.

For instances: Gets methods from the instance's direct prototype.

- `getMethods()`: string[]:

For classes: Gets all static methods (own and inherited).

For instances: Gets all methods (own instance methods, prototype methods, and inherited methods).

- `hasOwnMethod(name: string)`: boolean:

For classes: Checks for an own static method.

For instances: Checks for a method on the instance's direct prototype.

- `hasMethod(name: string)`: boolean: Checks if the target or its prototype chain has a method with the given name (includes instance-specific methods).

Instantiation and Type Checking
- `isInstantiable()`: boolean: Checks if the reflected target (typically a class) can be instantiated.

- `newInstance(...args: any[])`: object | null: Creates a new instance of the reflected class. Throws a TypeError if the target is not a constructor.

- `isInstanceCheck(obj: any)`: boolean: Checks if a given object obj is an instance of the reflected class (meaningful only when reflecting a class constructor).

Utility
- `toString()`: string: Returns a string representation of the reflected entity.
