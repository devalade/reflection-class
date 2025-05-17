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

```javascript
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
