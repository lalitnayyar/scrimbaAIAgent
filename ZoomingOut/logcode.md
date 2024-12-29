import fs from "fs"

        // Add timestamp to the log entry
        const timestamp = new Date().toISOString()
        const logEntry = `${timestamp} - ${JSON.stringify(toolCalls)}\n`
        fs.writeFileSync('log.txt', logEntry, { flag: 'a' })
