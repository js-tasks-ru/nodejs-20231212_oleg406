const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    it.only('валидатор проверяет строковые поля длиной меньше 10', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({name: 'Lalala'});

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too short, expect 10, got 6');
    });

    it.only('валидатор проверяет строковые поля длиной больше 20', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({name: 'AAAAaaaaaAAaaaaAAAAAaaaaaAAAAAAaaaAA'});

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too long, expect 20, got 36');
    });

    it.only('валидатор проверяет числовые поля меньше 10', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({age: 5});

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal(`too little, expect 10, got 5`);
    });

    it.only('валидатор проверяет числовые поля больше 20', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({age: 25});

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal(`too big, expect 20, got 25`);
    });

    it.only(
        'валидатор возвращает пустой массив ошибок, если получает пустой объект на входе',
        () => {
          const validator = new Validator({});

          const errors = validator.validate({});

          expect(errors).to.have.length(0);
        });

    it.only('валидатор возвращает пустой массив ошибок, если не получает объект на входе', () => {
      const validator = new Validator();

      const errors = validator.validate();

      expect(errors).to.have.length(0);
    });

    it.only(
        'валидатор возвращает одну ошибку, если объект условий состоит из одного поля undefined',
        () => {
          const validator = new Validator({
            undefined,
          });

          const errors = validator.validate({age: 5});

          expect(errors).to.have.length(1);
          expect(errors[0])
              .to.have.property('error').and.to.be.equal('expect rule not to be undefined');
        });

    it.only(
        'валидатор возвращает одну ошибку, если объект валидации состоит из одного поля undefined',
        () => {
          const validator = new Validator({
            age: {
              type: 'number',
              min: 10,
              max: 20,
            },
          });

          const errors = validator.validate({undefined});

          expect(errors).to.have.length(1);
          expect(errors[0])
              .to.have.property('error').and.to.be.equal('expect number, got undefined');
        });

    it.only('валидатор проверяет правило на число, если валидируется строка', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({age: 'aaa'});

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal(`expect number, got string`);
    });

    it.only('валидатор проверяет правило на строку, если валидируется число', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({name: 200});

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal(`expect string, got number`);
    });
  });
});
