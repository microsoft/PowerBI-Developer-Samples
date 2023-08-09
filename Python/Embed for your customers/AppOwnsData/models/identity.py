class Identity:
    customData = None
    datasets = None
    identityBlob = None
    reports = None
    roles = None
    username = None

    def __init__(self):
        self.datasets = []
        self.roles = []
        self.username = ''

    def get_dict(self):
        output = self.__dict__

        if self.identityBlob is not None:
            output['identityBlob'] = self.identityBlob.__dict__

        return output


class IdentityBlob:
    value = None

    def __init__(self):
        self.value = ''
