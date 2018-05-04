
const Grammr = {
	Check (statement, step) {
		switch (step) {
			case 0:
				return statement === 'SELECT'
			break;
			case 0:
				return statement === 'SELECT'
			break;
			default:

		}
	},
	Validate (SQL) {
		this.count = 0
		ths.SQL = SQL.split(/ +/g)

		this.SQL.forEach(statement => {
			if (this.Check(statement, this.count)) {
				this.count++
			} else {
				c('Fatal error')
			}
		})
	}
}
