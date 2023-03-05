import { getFormValues, setFormValues } from '../../src';
import * as utils from '../utils'

describe('misc', () => {
	describe('blank', () => {
		beforeEach(utils.setup(`
			<!DOCTYPE html>
			<html lang="en-PH">
				<head>
					<meta charset="UTF-8">
					<title>Misc/Blank</title>
				</head>
				<body>
					<form>
						<button type="submit">Submit</button>
					</form>
				</body>
			</html>
		`))

		it('should have blank form value', () => {
			utils.test({
				action: (cy: any) => cy.get('[type="submit"]'),
				test: (form: HTMLFormElement, submitter: any, search: any) => {
					const before = utils.makeSearchParams(getFormValues(form, { submitter }))
						.toString();
					const after = utils.makeSearchParams(search)
						.toString();
					expect(before)
						.toEqual(after);
				},
				expectedStaticValue: {},
			});
		});
	})

	describe('everything', () => {
		beforeEach(utils.setup(`
			<!DOCTYPE html>
			<html lang="en-PH">
				<head>
					<meta charset="UTF-8">
					<title>Misc/Everything</title>
				</head>
				<body>
					<article>
						<h2></h2>
						<form>
							<div>
								<input type="text" placeholder="First Name" name="first_name" />
							</div>
							<div>
								<input type="text" placeholder="Middle Name" name="middle_name" />
							</div>
							<div>
								<input type="text" placeholder="Last Name" name="last_name" />
							</div>
							<fieldset>
								<legend>Gender</legend>
								<div>
									<label>
										<input type="radio" name="gender" value="m" />
										Male
									</label>
									<label>
										<input type="radio" name="gender" value="f" />
										Female
									</label>
								</div>
							</fieldset>
							<div>
								<input type="date" placeholder="Birthday" name="birthday" />
							</div>
							<div>
								<select name="civil_status">
									<option value="">Select Civil Status</option>
									<option value="single">Single</option>
									<option value="married">Married</option>
									<option value="divorced">Divorced</option>
									<option value="separated">Separated</option>
								</select>
							</div>
							<div>
								<label>
									<input type="checkbox" name="new_registration" />
									New Registration
								</label>
							</div>
							<div>
								<input type="datetime-local" placeholder="Appointment Date/Time" name="appointment_datetime" />
							</div>
							<div>
								<label>
									<input type="checkbox" value="filipino" name="nationality" />
									Filipino
								</label>
							</div>
							<div>
								<input type="number" placeholder="Gross Salary" name="gross" />
							</div>
							<fieldset>
								<legend>
									Default Dependents
								</legend>
								<div>
									<label>
										<input type="radio" value="James" name="dependent" />
										James
									</label>
									<label>
										<input type="radio" value="Jun" name="dependent" />
										Jun
									</label>
								</div>
							</fieldset>
							<div>
								<button type="button" class="dependents">
									Add Dependents
								</button>
							</div>
							<div>
								<textarea name="notes" placeholder="Notes"></textarea>
							</div>
							<div>
								<label>
									Quality of Service
									<input type="range" min="0" max="10" placeholder="Quality of Service" name="qos" />
								</label>
							</div>
							<div>
								<button name="submit" value="Hello" type="submit">Hello</button>
								<button name="submit" value="Hi" type="submit">Hi</button>
							</div>
						</form>
					</article>
					<script>
						Array.from(document.getElementsByClassName('dependents')).forEach(d => {
							d.addEventListener('click', e => {
								const container = document.createElement('div')
								const input = document.createElement('input')
								input.name = 'dependent'
								input.type = 'text'
								input.placeholder = 'Dependent'
								container.classList.add('additional-dependent')
								container.appendChild(input)
								e.target.parentElement.parentElement.insertBefore(container, e.target.parentElement)
							})
						})
					</script>
				</body>
			</html>
		`))

		it('should have correct form values', () => {
			utils.test({
				action: (cy) => {
					cy.get('[name="first_name"]')
						.type('John')
					cy.get('[name="middle_name"]')
						.type('Marcelo')
					cy.get('[name="last_name"]')
						.type('Dela Cruz')
					cy.get('[name="gender"][value="m"]')
						.check()
					cy.get('[name="birthday"]')
						.type('1989-06-04')
					cy.get('[name="civil_status"]')
						.select('Married')
					cy.get('[name="new_registration"]')
						.check()
					cy.get('[name="appointment_datetime"]')
						.type('2001-09-11T06:09')
					cy.get('[name="nationality"][value="filipino"]')
						.check()
					cy.get('[name="gross"]')
						.type('131072')
					cy.get('[name="dependent"][value="Jun"]')
						.check()

					cy.get('button.dependents')
						.click()
					cy.get('.additional-dependent [name="dependent"][type="text"]')
						.last()
						.type('Juana')
					cy.get('button.dependents')
						.click()
					cy.get('.additional-dependent [name="dependent"][type="text"]')
						.last()
						.type('Jane')
					cy.get('button.dependents')
						.click()
					cy.get('.additional-dependent [name="dependent"][type="text"]')
						.last()
						.type('Josh')
					cy.get('[name="qos"]')
						.invoke('val', 10)
						.trigger('change')
					cy.get('[name="notes"]')
						.type('Test content\n\nNew line\n\nAnother line')
					return cy.get('[name="submit"][value="Hi"]')
				},
				test: (form: HTMLFormElement, submitter: any, search: any) => {
					const before = utils.makeSearchParams(getFormValues(form, { submitter }))
						.toString();
					const after = utils.makeSearchParams(search)
						.toString();

					expect(before)
						.toEqual(after);
				},
				expectedStaticValue: 'first_name=John&middle_name=Marcelo&last_name=Dela+Cruz&gender=m&birthday=1989-06-04&civil_status=married&new_registration=on&appointment_datetime=2001-09-11T06%3A09&nationality=filipino&gross=131072&dependent=Jun&notes=Test+content%0D%0A%0D%0ANew+line%0D%0A%0D%0AAnother+line&qos=10&submit=Hi',
			});
		});

		it('should have filled form values', () => {
			utils.test({
				action: (cy) => cy.wait(3000).get('[name="submit"][value="Hi"]'),
				test: (form: HTMLFormElement, submitter: any, search: any) => {
					const before = utils.makeSearchParams(getFormValues(form, { submitter }))
						.toString();
					const after = utils.makeSearchParams(search)
						.toString();
					expect(before)
						.toEqual(after);
				},
				preAction: (form: HTMLFormElement) => {
					setFormValues(form, {
						first_name: 'John',
						middle_name: 'Marcelo',
						last_name: 'Dela Cruz',
						gender: 'm',
						birthday: new Date('1989-06-04'),
						civil_status: 'married',
						new_registration: 'on',
						appointment_datetime: new Date('2001-09-11T06:09:00'),
						nationality: 'filipino',
						gross: 131072,
						dependent: 'Jun',
						notes: `Test content

New line

Another line`,
						qos: 10,
					});
				},
				expectedStaticValue: 'first_name=John&middle_name=Marcelo&last_name=Dela+Cruz&gender=m&birthday=1989-06-04&civil_status=married&new_registration=on&appointment_datetime=2001-09-11T06%3A09&nationality=filipino&gross=131072&dependent=Jun&notes=Test+content%0D%0A%0D%0ANew+line%0D%0A%0D%0AAnother+line&qos=10&submit=Hi',
			});
		});
	})
})
