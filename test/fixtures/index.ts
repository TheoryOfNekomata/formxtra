import fs from 'fs'
import path from 'path'
import {DOMWindow, JSDOM} from 'jsdom'

export type Window = DOMWindow

export const loadTemplate = async (templateName: string): Promise<Window> => {
	const templatePath = path.join('test', 'fixtures', 'templates', `${templateName}.html`)
	const templateRaw = await fs.promises.readFile(templatePath)
	return new JSDOM(templateRaw.toString('utf-8')).window
}
