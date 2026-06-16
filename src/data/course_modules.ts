import type { Module } from "@/types/course_modules";

export const MODULES_DATA: Record<string, Module> = {
  "1": {
    id: "1",
    title: "Algebra Fundamentals",
    lessons: [
      {
        id: "1-1",
        title: "Introduction to Variables",
        duration: "8 min",
        type: "video",
        status: "completed",
        description: "Learn what variables are and how they're used in algebraic expressions.",
        overview:
          "Variables are symbols (usually letters) that stand in for unknown or changing values. This lesson establishes the vocabulary and intuition you'll need for every topic that follows.",
      },
      {
        id: "1-2",
        title: "Expressions and Equations",
        duration: "12 min",
        type: "video",
        status: "completed",
        description: "Understand the core distinction between expressions and equations.",
        overview:
          "An expression is a combination of numbers, variables, and operations with no equal sign. An equation asserts that two expressions are equal. Confusing these two concepts is one of the most common early mistakes in algebra.",
      },
      {
        id: "1-3",
        title: "Order of Operations",
        duration: "10 min",
        type: "video",
        status: "current",
        description: "Master PEMDAS and solve multi-step expressions without errors.",
        overview:
          "PEMDAS (Parentheses, Exponents, Multiplication/Division, Addition/Subtraction) defines the order in which operations are evaluated. Skipping or reversing steps here silently produces wrong answers, making it one of the highest-impact fundamentals to nail early.",
      },
      {
        id: "1-4",
        title: "Reading: Algebra in the Real World",
        duration: "5 min",
        type: "reading",
        status: "locked",
        description: "See how algebra applies to everyday scenarios.",
        overview:
          "From budgeting your monthly expenses to writing code that scales, algebra is everywhere. This short reading makes abstract concepts tangible through concrete examples.",
      },
    ],
  },
  "2": {
    id: "2",
    title: "Linear Equations",
    lessons: [
      {
        id: "2-1",
        title: "Solving One-Step Equations",
        duration: "10 min",
        type: "video",
        status: "completed",
        description: "Isolate a variable using a single inverse operation.",
        overview:
          "One-step equations are solved by applying the inverse operation to both sides. Addition undoes subtraction and vice versa; multiplication undoes division.",
      },
      {
        id: "2-2",
        title: "Two-Step Equations",
        duration: "14 min",
        type: "video",
        status: "completed",
        description: "Extend your skills to equations requiring two operations.",
        overview:
          "Work in reverse PEMDAS order — undo addition/subtraction first, then multiplication/division. Keeping track of each step on both sides prevents the most common errors.",
      },
      {
        id: "2-3",
        title: "Variables on Both Sides",
        duration: "15 min",
        type: "video",
        status: "current",
        description: "Collect variable terms on one side before solving.",
        overview:
          "When the unknown appears on both sides, move all variable terms to one side and all constants to the other. This reduces the equation to a familiar one-step or two-step form.",
      },
      {
        id: "2-4",
        title: "Word Problems with Linear Equations",
        duration: "12 min",
        type: "video",
        status: "locked",
        description: "Translate real-world problems into equations and solve them.",
        overview:
          "Read carefully, identify what is unknown, assign a variable, write the equation, then solve. The translation step — not the algebra — is where most students struggle.",
      },
      {
        id: "2-5",
        title: "Quiz: Linear Equations",
        duration: "20 min",
        type: "quiz",
        status: "locked",
        description: "Test your understanding across all lessons in this module.",
        overview:
          "Score 70% or higher to unlock the next module. The quiz is timed and covers one-step, two-step, and variable-on-both-sides equations, plus one word problem.",
      },
    ],
  },
  "3": {
    id: "3",
    title: "Quadratic Functions",
    lessons: [
      {
        id: "3-1",
        title: "What is a Quadratic?",
        duration: "9 min",
        type: "video",
        status: "current",
        description: "Recognise the standard form and key features of quadratic functions.",
        overview:
          "A quadratic function has the form f(x) = ax² + bx + c where a ≠ 0. The graph is a parabola — understanding its shape and symmetry is the first step toward mastering this topic.",
      },
      {
        id: "3-2",
        title: "Factoring Quadratics",
        duration: "18 min",
        type: "video",
        status: "locked",
        description: "Factor trinomials to find roots without the quadratic formula.",
        overview:
          "Factoring is the fastest route to solving many quadratics. We look for two numbers that multiply to ac and add to b, then rewrite and group. This skill also appears throughout calculus.",
      },
      {
        id: "3-3",
        title: "The Quadratic Formula",
        duration: "14 min",
        type: "video",
        status: "locked",
        description: "Solve any quadratic equation using the universal formula.",
        overview:
          "x = (−b ± √(b²−4ac)) / 2a always works, even when factoring fails. The discriminant (b²−4ac) tells you whether there are two real roots, one repeated root, or no real roots.",
      },
      {
        id: "3-4",
        title: "Reading: Parabolas in the Real World",
        duration: "6 min",
        type: "reading",
        status: "locked",
        description: "Explore where quadratics appear in physics, engineering, and design.",
        overview:
          "Projectile motion, suspension bridges, satellite dishes, and headlight reflectors all rely on the parabolic shape. This reading connects your algebra skills to real engineering problems.",
      },
      {
        id: "3-5",
        title: "Quiz: Quadratic Functions",
        duration: "25 min",
        type: "quiz",
        status: "locked",
        description: "Comprehensive quiz covering factoring, the formula, and graphing.",
        overview:
          "This quiz tests factoring, applying the quadratic formula, interpreting the discriminant, and identifying features of parabolas from equations.",
      },
      {
        id: "3-6",
        title: "Graphing Parabolas",
        duration: "16 min",
        type: "video",
        status: "locked",
        description: "Plot quadratics by finding the vertex, axis of symmetry, and intercepts.",
        overview:
          "Start with the vertex (h, k), draw the axis of symmetry at x = h, plot the y-intercept at (0, c), mirror points across the axis, and connect. Recognising the graph's shape from the equation is a powerful problem-solving tool.",
      },
    ],
  },
  "4": {
    id: "4",
    title: "Trigonometry Basics",
    lessons: [
      {
        id: "4-1",
        title: "Angles and the Unit Circle",
        duration: "11 min",
        type: "video",
        status: "current",
        description: "Build intuition for angles in degrees and radians on the unit circle.",
        overview:
          "The unit circle is a circle of radius 1 centred at the origin. Every angle maps to a point (cos θ, sin θ) on it. Memorising the key values at 0°, 30°, 45°, 60°, and 90° saves significant time later.",
      },
      {
        id: "4-2",
        title: "SOH-CAH-TOA",
        duration: "13 min",
        type: "video",
        status: "locked",
        description: "Define sine, cosine, and tangent using right triangle ratios.",
        overview:
          "SOH: sin = opposite/hypotenuse. CAH: cos = adjacent/hypotenuse. TOA: tan = opposite/adjacent. These ratios are the entry point to all of trigonometry.",
      },
      {
        id: "4-3",
        title: "Reading: Trig in Navigation & Engineering",
        duration: "5 min",
        type: "reading",
        status: "locked",
        description: "See how sine and cosine power GPS, acoustics, and structural design.",
        overview:
          "Trigonometric functions describe waves, rotations, and oscillations. They appear in signal processing, architecture, and robotics — understanding them opens doors across STEM fields.",
      },
      {
        id: "4-4",
        title: "Solving Right Triangles",
        duration: "15 min",
        type: "video",
        status: "locked",
        description: "Find all unknown sides and angles of a right triangle.",
        overview:
          "Given one side and one angle (or two sides), you can determine every measurement of a right triangle using SOH-CAH-TOA and the Pythagorean theorem. This is the core practical skill of introductory trigonometry.",
      },
    ],
  },
};
