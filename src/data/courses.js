// Course catalogue. One file so contributors can see the whole map at once.
// status: 'open' = has lessons, 'writing' = planned, help wanted.
// Unit items: kind lesson | practice | lab | quiz; href set only when it exists.

export const courses = [
  {
    slug: 'digital-logic',
    title: 'Digital logic and Verilog',
    art: 'gate',
    blurb: 'Gates, flip-flops and state machines, then write them in Verilog and run them on an FPGA.',
    meta: 'Start here',
    status: 'open',
    units: [
      {
        title: 'Bits and gates',
        skills: ['Binary and bits', 'Logic gates', 'Truth tables', 'Boolean algebra', 'Combinational circuits'],
        items: [
          { kind: 'lesson', title: 'What a logic gate really is', href: '/learn/digital-logic/logic-gates/', minutes: 8 },
          { kind: 'lesson', title: 'Truth tables and Boolean algebra', minutes: 10 },
          { kind: 'practice', title: 'Build a 2-to-1 multiplexer' },
        ],
      },
      {
        title: 'Flip-flops and clocks',
        skills: ['Clocks and edges', 'The D flip-flop', 'Registers', 'Counters', 'Setup and hold'],
        items: [
          { kind: 'lesson', title: 'Clocks and edges', href: '/learn/digital-logic/clocks-and-edges/', minutes: 6 },
          { kind: 'lesson', title: 'The D flip-flop', href: '/learn/digital-logic/d-flip-flop/', minutes: 12 },
          { kind: 'practice', title: 'Draw the waveform', href: '/practice/draw-the-waveform/' },
          { kind: 'lab', title: 'Rising-edge detector', href: '/lab/' },
          { kind: 'lesson', title: 'Setup and hold, gently', minutes: 10 },
        ],
      },
      {
        title: 'State machines',
        skills: ['States and transitions', 'Moore vs Mealy', 'Encoding states', 'Traffic light FSM'],
        items: [{ kind: 'lesson', title: 'Your first state machine', minutes: 14 }],
      },
      {
        title: 'Verilog for design',
        skills: ['Modules and ports', 'always blocks', 'Blocking vs non-blocking', 'Parameters'],
        items: [{ kind: 'lesson', title: 'Modules, wires and regs', minutes: 12 }],
      },
      {
        title: 'Testbenches',
        skills: ['Stimulus', 'Self-checking tests', 'Reading waveforms'],
        items: [{ kind: 'lesson', title: 'Your first testbench', minutes: 12 }],
      },
      {
        title: 'Your first FPGA',
        skills: ['Open toolchain', 'Pin constraints', 'Blinky', 'UART transmitter'],
        items: [{ kind: 'lesson', title: 'Blink an LED on a Tang Nano 9K', minutes: 20 }],
      },
    ],
  },
  { slug: 'computer-architecture', title: 'Computer architecture', art: 'arch', blurb: "How a CPU really runs your code: pipelines, caches and buses. You'll build a small RISC-V core.", meta: 'After digital logic', status: 'writing' },
  { slug: 'verification', title: 'Verification', art: 'verify', blurb: "Prove a design works before it's built: testbenches, cocotb, SystemVerilog, UVM and formal.", meta: 'After digital logic', status: 'writing' },
  { slug: 'fpga', title: 'FPGA design', art: 'fpga', blurb: 'Put your designs on real hardware with open tools: UART, video output and a soft CPU.', meta: 'After digital logic', status: 'writing' },
  { slug: 'chip-design', title: 'Chip design', art: 'wafer', blurb: 'From RTL to GDS with open tools, finishing with a real tapeout on a shared shuttle.', meta: 'After timing', status: 'writing' },
  { slug: 'timing', title: 'Timing and synthesis', art: 'timing', blurb: 'What your code turns into, how fast it can run, and why clocks crossing domains is scary.', meta: 'After digital logic', status: 'writing' },
  { slug: 'pcb', title: 'PCB design', art: 'board', blurb: 'Schematics, layout, power and bring-up in KiCad. Design a board and order it.', meta: 'No prerequisites', status: 'writing' },
  { slug: 'rf', title: 'RF basics', art: 'rf', blurb: 'Transmission lines, the Smith chart and matching, with calculators you can play with.', meta: 'After PCB design', status: 'writing' },
  { slug: 'firmware', title: 'Embedded firmware', art: 'mcu', blurb: 'Bare-metal C, registers, interrupts and drivers. Simulated boards included.', meta: 'No prerequisites', status: 'writing' },
];

export const roadmaps = [
  {
    id: 'rtl', name: 'RTL design', what: 'Writes the logic inside chips and FPGAs: datapaths, state machines, interfaces.',
    projects: ['UART transmitter and receiver', 'A 5-stage RISC-V core on FPGA', 'Your own Tiny Tapeout design'],
    interview: 'FIFOs, clock-domain crossing, FSM coding and timing questions come up most.',
    stages: [
      { name: 'Foundations', units: ['Logic gates', 'Truth tables', 'Combinational circuits'] },
      { name: 'Memory and state', units: ['The D flip-flop', 'Counters', 'State machines'] },
      { name: 'Verilog for design', units: ['Modules and ports', 'always blocks', 'Parameters'] },
      { name: 'Making it real', units: ['Synthesis', 'Static timing', 'Clock-domain crossing'] },
      { name: 'Systems', units: ['Bus protocols: APB, AXI', 'Computer architecture', 'Low power'] },
    ],
  },
  {
    id: 'dv', name: 'Verification', what: 'Proves a design works before it is built, using testbenches, coverage and formal tools.',
    projects: ['cocotb testbench for a FIFO', 'UVM environment for an APB slave', 'Formal proof of an arbiter'],
    interview: 'SystemVerilog OOP, constrained random, coverage and debugging a failing test.',
    stages: [
      { name: 'Foundations', units: ['Logic gates', 'The D flip-flop'] },
      { name: 'Testbench basics', units: ['Self-checking tests', 'cocotb'] },
      { name: 'SystemVerilog', units: ['Classes', 'Constrained random', 'Assertions'] },
      { name: 'UVM', units: ['Agents and sequences', 'Scoreboards', 'Coverage'] },
      { name: 'Formal', units: ['SymbiYosys', 'Proving properties'] },
    ],
  },
  {
    id: 'pd', name: 'Physical design', what: 'Turns a netlist into a real layout: placement, routing and timing closure.',
    projects: ['Run RTL to GDS with OpenLane', 'Close timing on a small core'],
    interview: 'Setup and hold, clock trees, congestion and reading timing reports.',
    stages: [
      { name: 'Foundations', units: ['Logic gates', 'CMOS basics'] },
      { name: 'Synthesis', units: ['Standard cells', 'Yosys'] },
      { name: 'Layout', units: ['Floorplanning', 'Place and route'] },
      { name: 'Sign-off', units: ['Static timing', 'DRC and LVS'] },
    ],
  },
  {
    id: 'fpga', name: 'FPGA', what: 'Builds systems on programmable chips, from video pipelines to soft CPUs.',
    projects: ['HDMI output on a Tang Nano', 'RISC-V soft core with peripherals'],
    interview: 'Resource usage, timing constraints and debugging on real hardware.',
    stages: [
      { name: 'Foundations', units: ['Logic gates', 'The D flip-flop'] },
      { name: 'Verilog', units: ['Modules and ports', 'always blocks'] },
      { name: 'Toolchain', units: ['Open toolchain', 'Pin constraints'] },
      { name: 'Systems', units: ['UART transmitter', 'Video', 'Soft CPUs'] },
    ],
  },
  {
    id: 'hw', name: 'Hardware (PCB)', what: 'Designs the boards chips live on: schematics, layout, power and bring-up.',
    projects: ['A USB-powered microcontroller board', 'RF front-end with a bias tee'],
    interview: 'Decoupling, impedance, power budgets and how you debug a dead board.',
    stages: [
      { name: 'Circuits', units: ['Ohm and Kirchhoff', 'Passives'] },
      { name: 'Schematics', units: ['KiCad basics', 'Reading datasheets'] },
      { name: 'Layout', units: ['Layout rules', 'Power and decoupling'] },
      { name: 'Advanced', units: ['RF basics', 'Bring-up'] },
    ],
  },
  {
    id: 'fw', name: 'Embedded', what: 'Writes the code that runs directly on microcontrollers and talks to hardware.',
    projects: ['Bare-metal drivers for UART, SPI, I2C', 'A small RTOS-based sensor node'],
    interview: 'Pointers, volatile, interrupts and memory-mapped registers.',
    stages: [
      { name: 'C for hardware', units: ['Bits and pointers'] },
      { name: 'Bare metal', units: ['Memory-mapped I/O', 'Interrupts'] },
      { name: 'Drivers', units: ['UART', 'SPI', 'I2C'] },
      { name: 'Systems', units: ['RTOS basics', 'Low power'] },
    ],
  },
];

/** Stable id for a skill name, used as the localStorage key. */
export const skillId = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
