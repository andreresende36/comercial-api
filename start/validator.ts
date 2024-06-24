import { validator } from '@ioc:Adonis/Core/Validator';
import { cpf } from 'cpf-cnpj-validator';

validator.rule('cpf', (value, _, options) => {
  if (!value) {
    return;
  }

  const isValid = cpf.isValid(value);
  if (!isValid) {
    options.errorReporter.report(
      options.pointer,
      'cpf',
      'Invalid CPF',
      options.arrayExpressionPointer,
    );
  }
});

validator.rule('sex', (value: string, _, options) => {
  if (!value) {
    return;
  }
  const valueLowerCase = value.toLowerCase();
  const isValid =
    valueLowerCase === 'masculino' ||
    valueLowerCase === 'feminino' ||
    valueLowerCase === 'outros';
  if (!isValid) {
    options.errorReporter.report(
      options.pointer,
      'sex',
      'Invalid sex type',
      options.arrayExpressionPointer,
    );
  }
});
