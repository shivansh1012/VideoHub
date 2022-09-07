class bcolors:
    HEADER = '\033[34m'
    SUCCESS = '\033[92m' # Green Text
    WARNING = '\033[93m' # Yellow Text
    FAIL = '\033[91m' # Red Text
    INPUT = '\033[100m' # Blue Text

    REDBACKGROUND = '\33[41m'
    BLINKING = '\033[6m'

    ENDC = '\033[0m'

    def disable(self):
        self.HEADER = ''
        self.SUCCESS = ''
        self.WARNING = ''
        self.FAIL = ''
        self.INPUT = ''
        self.REDBACKGROUND = ''
        self.BLINKING = ''
        self.ENDC = ''
