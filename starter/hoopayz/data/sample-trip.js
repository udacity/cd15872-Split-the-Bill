// Static course data: imported with ordinary ES module syntax.
const sample = {
  members: ["Alex", "Sam", "Jordan"],
  expenses: [
    {
      id: "dinner",
      description: "Welcome dinner",
      payer: "Alex",
      participants: ["Alex", "Sam", "Jordan"],
      amountCents: 10000,
      category: "Food",
      type: "even",
      tags: ["weekend"],
    },
    {
      id: "cabin",
      description: "Lakeside cabin",
      payer: "Sam",
      participants: ["Alex", "Sam", "Jordan"],
      amountCents: 24000,
      category: "Stay",
      type: "share",
      weights: [1, 2, 1],
    },
    {
      id: "ride",
      description: "Ride to the lake",
      payer: "Jordan",
      participants: ["Alex", "Sam", "Jordan"],
      amountCents: 5001,
      category: "Travel",
      type: "share",
      weights: [2, 1, 1],
    },
  ],
};

export default sample;
