declare module '@ioc:Adonis/Core/Validator' {
  interface Rules {
    cpf(): Rule;
    sex(): Rule;
  }
}
