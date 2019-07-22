import os
import sys
import unittest
my_dir = os.path.dirname(os.path.realpath(__file__))
sys.path.append(my_dir + '/../')


class EngineTest(unittest.TestCase):

    def initial_test(self):
        self.assertEquals(False, True)


if __name__ == "__main__":
    unittest.main()
