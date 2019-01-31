module.exports = (to, schema, model, reqBody) => {
  key1 = Object.keys(schema)[0]
  key2 = Object.keys(schema.body)[0]
  key = `${key1}.${key2}`

  if (!to.paths.hasOwnProperty(key)) to.add(schema);
  model = Object.assign(schema, model)
  for (i in model) {
    if (typeof model[i] === "object") {
      for (n in model[i]) {
        model[i][n] = reqBody[n]
      };
    };
    if (typeof model[i] !== "object") {
      model[i] = reqBody[i]
    }
  };
  return model
}