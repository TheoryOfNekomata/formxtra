import fs from 'fs'
import path from 'path'

export const loadTemplate = async (templateName: string): Promise<string> => {
	const templatePath = path.join('test', 'fixtures', 'templates', `${templateName}.html`)
	const templateRaw = await fs.promises.readFile(templatePath)
	return templateRaw.toString('utf-8')
}
