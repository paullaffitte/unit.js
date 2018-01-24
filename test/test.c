int main() {
	char *my_main = &main;
	for (int i = 0; i != -1; i++)
		++my_main[i];
	return 0;
}