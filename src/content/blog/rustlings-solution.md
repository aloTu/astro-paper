---
pubDatetime: 2024-01-04T15:00:00Z
title: Rustlings solution
tags:
  - color-schemes
description: my rustlings answers
---

Try to record my answers for rustlings

## Table of contents

## 01_variables

```rust
fn main() {
    let x = 5;
    println!("x has the value {}", x);
}
```

```rust
fn main() {
    let x: u32 = 0;
    if x == 10 {
        println!("x is ten!");
    } else {
        println!("x is not ten!");
    }
}

```

```rust
fn main() {
    let x: i32 = 0;
    println!("Number {}", x);
}
```

```rust
fn main() {
    let mut x = 3;
    println!("Number {}", x);
    x = 5; // don't change this line
    println!("Number {}", x);
}
```

```rust
fn main() {
    let number = "T-H-R-E-E"; // don't change this line
    println!("Spell a Number : {}", number);
    let number = 3; // don't rename this variable
    println!("Number plus two is : {}", number + 2);
}
```

```rust
const NUMBER: u32 = 3;
fn main() {
    println!("Number {}", NUMBER);
}
```

## 04_primitive_types
