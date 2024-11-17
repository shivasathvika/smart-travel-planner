from setuptools import setup, find_packages

setup(
    name="smart-travel-planner",
    version="0.1",
    packages=find_packages(),
    install_requires=[
        "fastapi",
        "uvicorn",
        "sqlalchemy",
        "pydantic",
        "pydantic-settings",
        "python-dotenv",
        "httpx",
    ],
)
